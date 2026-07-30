<?php

namespace App\Services;

use App\Enums\JobPostingStatus;
use App\Enums\LikeStatus;
use App\Enums\LikeType;
use App\Models\JobPosting;
use App\Models\Like;
use App\Models\User;
use App\Notifications\LikeExpired;
use App\Notifications\LikeMatched;
use App\Notifications\NewLikeReceived;
use Illuminate\Validation\ValidationException;

class LikeService
{
    private const STANDARD_MONTHLY_LIMIT = 10;

    private const SUPER_MONTHLY_LIMIT = 1;

    public function apply(User $user, JobPosting $jobPosting, LikeType $likeType, string $motivation): Like
    {
        if ($jobPosting->status !== JobPostingStatus::Published) {
            throw ValidationException::withMessages([
                'job_posting_id' => 'この求人は現在応募を受け付けていません。',
            ]);
        }

        if ($user->likes()->where('job_posting_id', $jobPosting->id)->exists()) {
            throw ValidationException::withMessages([
                'job_posting_id' => 'この求人にはすでに応募済みです。',
            ]);
        }

        $limit = $likeType === LikeType::Super ? self::SUPER_MONTHLY_LIMIT : self::STANDARD_MONTHLY_LIMIT;

        $monthlyCount = $user->likes()
            ->where('like_type', $likeType)
            ->whereBetween('applied_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->count();

        if ($monthlyCount >= $limit) {
            throw ValidationException::withMessages([
                'like_type' => $likeType === LikeType::Super
                    ? '今月のスーパーいいねの上限(1件)に達しています。'
                    : '今月のいいねの上限(10件)に達しています。',
            ]);
        }

        $like = $user->likes()->create([
            'job_posting_id' => $jobPosting->id,
            'like_type' => $likeType,
            'motivation' => $motivation,
            'status' => LikeStatus::Applied,
            'applied_at' => now(),
            'response_deadline' => now()->addDays(7),
        ]);

        $jobPosting->company->notify(new NewLikeReceived($like));

        return $like;
    }

    public function match(Like $like): Like
    {
        if ($like->status !== LikeStatus::Applied) {
            throw ValidationException::withMessages([
                'status' => 'すでに反応済み、または対象外の応募です。',
            ]);
        }

        if (now()->greaterThan($like->response_deadline)) {
            throw ValidationException::withMessages([
                'status' => '反応期限(7日)を過ぎています。',
            ]);
        }

        $like->update([
            'status' => LikeStatus::Matched,
            'company_responded_at' => now(),
        ]);

        $like->user->notify(new LikeMatched($like));

        return $like;
    }

    public function expireOverdue(): int
    {
        $overdueLikes = Like::query()
            ->where('status', LikeStatus::Applied)
            ->where('response_deadline', '<', now())
            ->get();

        foreach ($overdueLikes as $like) {
            $like->update(['status' => LikeStatus::Expired]);
            $like->user->notify(new LikeExpired($like));
        }

        return $overdueLikes->count();
    }
}

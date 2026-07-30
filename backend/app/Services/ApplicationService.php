<?php

namespace App\Services;

use App\Enums\ApplicationStatus;
use App\Enums\JobPostingStatus;
use App\Enums\LikeType;
use App\Models\Application;
use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class ApplicationService
{
    private const STANDARD_MONTHLY_LIMIT = 10;

    private const SUPER_MONTHLY_LIMIT = 1;

    public function apply(User $user, JobPosting $jobPosting, LikeType $likeType): Application
    {
        if ($jobPosting->status !== JobPostingStatus::Published) {
            throw ValidationException::withMessages([
                'job_posting_id' => 'この求人は現在応募を受け付けていません。',
            ]);
        }

        if ($user->applications()->where('job_posting_id', $jobPosting->id)->exists()) {
            throw ValidationException::withMessages([
                'job_posting_id' => 'この求人にはすでに応募済みです。',
            ]);
        }

        $limit = $likeType === LikeType::Super ? self::SUPER_MONTHLY_LIMIT : self::STANDARD_MONTHLY_LIMIT;

        $monthlyCount = $user->applications()
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

        return $user->applications()->create([
            'job_posting_id' => $jobPosting->id,
            'like_type' => $likeType,
            'status' => ApplicationStatus::Applied,
            'applied_at' => now(),
            'response_deadline' => now()->addDays(7),
        ]);
    }

    public function match(Application $application): Application
    {
        if ($application->status !== ApplicationStatus::Applied) {
            throw ValidationException::withMessages([
                'status' => 'すでに反応済み、または対象外の応募です。',
            ]);
        }

        if (now()->greaterThan($application->response_deadline)) {
            throw ValidationException::withMessages([
                'status' => '反応期限(7日)を過ぎています。',
            ]);
        }

        $application->update([
            'status' => ApplicationStatus::Matched,
            'company_responded_at' => now(),
        ]);

        return $application;
    }

    public function expireOverdue(): int
    {
        return Application::query()
            ->where('status', ApplicationStatus::Applied)
            ->where('response_deadline', '<', now())
            ->update(['status' => ApplicationStatus::Expired]);
    }
}

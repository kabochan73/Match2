<?php

namespace App\Services;

use App\Enums\JobPostingStatus;
use App\Models\JobPosting;
use Illuminate\Validation\ValidationException;

class JobPostingService
{
    public function publish(JobPosting $jobPosting): JobPosting
    {
        if ($jobPosting->status !== JobPostingStatus::Draft) {
            throw ValidationException::withMessages([
                'status' => '下書き状態の求人のみ公開できます。',
            ]);
        }

        $jobPosting->update([
            'status' => JobPostingStatus::Published,
            'published_at' => now(),
        ]);

        return $jobPosting;
    }

    public function close(JobPosting $jobPosting): JobPosting
    {
        if ($jobPosting->status !== JobPostingStatus::Published) {
            throw ValidationException::withMessages([
                'status' => '公開中の求人のみ募集終了にできます。',
            ]);
        }

        $jobPosting->update([
            'status' => JobPostingStatus::Closed,
        ]);

        return $jobPosting;
    }
}

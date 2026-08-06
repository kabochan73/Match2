<?php

namespace App\Services;

use App\Enums\JobPostingStatus;
use App\Models\Company;
use App\Models\JobPosting;
use Illuminate\Validation\ValidationException;

class JobPostingService
{
    public function __construct(private RevalidationService $revalidationService) {}

    public function publish(JobPosting $jobPosting): JobPosting
    {
        if (! in_array($jobPosting->status, [JobPostingStatus::Draft, JobPostingStatus::Unpublished], true)) {
            throw ValidationException::withMessages([
                'status' => '下書きまたは非公開状態の求人のみ公開できます。',
            ]);
        }

        $jobPosting->update([
            'status' => JobPostingStatus::Published,
            'published_at' => now(),
        ]);

        $this->revalidationService->jobPosting($jobPosting);

        return $jobPosting;
    }

    public function unpublishAllForCompany(Company $company): void
    {
        $company->jobPostings()
            ->where('status', JobPostingStatus::Published)
            ->each(function (JobPosting $jobPosting): void {
                $jobPosting->update(['status' => JobPostingStatus::Unpublished]);

                $this->revalidationService->jobPosting($jobPosting);
            });
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

        $this->revalidationService->jobPosting($jobPosting);

        return $jobPosting;
    }
}

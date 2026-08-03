<?php

namespace App\Services;

use App\Models\JobPosting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class RevalidationService
{
    public function jobPosting(JobPosting $jobPosting): void
    {
        $url = config('services.frontend.revalidate_url');
        $secret = config('services.frontend.revalidate_secret');

        if (! $url || ! $secret) {
            return;
        }

        try {
            Http::withHeaders(['X-Revalidate-Secret' => $secret])
                ->timeout(3)
                ->post($url, ['job_posting_id' => $jobPosting->id]);
        } catch (Throwable $e) {
            Log::warning('Failed to trigger frontend revalidation', [
                'job_posting_id' => $jobPosting->id,
                'message' => $e->getMessage(),
            ]);
        }
    }
}

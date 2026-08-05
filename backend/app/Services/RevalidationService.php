<?php

namespace App\Services;

use App\Models\Company;
use App\Models\JobPosting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class RevalidationService
{
    public function jobPosting(JobPosting $jobPosting): void
    {
        $this->trigger(['job_posting_id' => $jobPosting->id]);
    }

    public function company(Company $company): void
    {
        $this->trigger(['company_id' => $company->id]);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function trigger(array $payload): void
    {
        $url = config('services.frontend.revalidate_url');
        $secret = config('services.frontend.revalidate_secret');

        if (! $url || ! $secret) {
            return;
        }

        try {
            Http::withHeaders(['X-Revalidate-Secret' => $secret])
                ->timeout(3)
                ->post($url, $payload);
        } catch (Throwable $e) {
            Log::warning('Failed to trigger frontend revalidation', [
                ...$payload,
                'message' => $e->getMessage(),
            ]);
        }
    }
}

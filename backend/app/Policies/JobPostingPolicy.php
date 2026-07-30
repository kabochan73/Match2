<?php

namespace App\Policies;

use App\Models\Company;
use App\Models\JobPosting;

class JobPostingPolicy
{
    public function view(Company $company, JobPosting $jobPosting): bool
    {
        return $company->id === $jobPosting->company_id;
    }

    public function update(Company $company, JobPosting $jobPosting): bool
    {
        return $company->id === $jobPosting->company_id;
    }

    public function delete(Company $company, JobPosting $jobPosting): bool
    {
        return $company->id === $jobPosting->company_id;
    }
}

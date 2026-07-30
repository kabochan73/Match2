<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\Company;
use App\Models\User;

class ApplicationPolicy
{
    public function view(User $user, Application $application): bool
    {
        return $user->id === $application->user_id;
    }

    public function viewAsCompany(Company $company, Application $application): bool
    {
        return $company->id === $application->jobPosting->company_id;
    }

    public function match(Company $company, Application $application): bool
    {
        return $company->id === $application->jobPosting->company_id;
    }
}

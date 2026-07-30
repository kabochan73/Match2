<?php

namespace App\Policies;

use App\Models\Company;
use App\Models\Like;
use App\Models\User;

class LikePolicy
{
    public function view(User $user, Like $like): bool
    {
        return $user->id === $like->user_id;
    }

    public function viewAsCompany(Company $company, Like $like): bool
    {
        return $company->id === $like->jobPosting->company_id;
    }

    public function match(Company $company, Like $like): bool
    {
        return $company->id === $like->jobPosting->company_id;
    }
}

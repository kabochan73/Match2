<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WorkExperience;

class WorkExperiencePolicy
{
    public function update(User $user, WorkExperience $workExperience): bool
    {
        return $user->id === $workExperience->user_id;
    }

    public function delete(User $user, WorkExperience $workExperience): bool
    {
        return $user->id === $workExperience->user_id;
    }
}

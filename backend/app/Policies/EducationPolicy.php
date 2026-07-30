<?php

namespace App\Policies;

use App\Models\Education;
use App\Models\User;

class EducationPolicy
{
    public function update(User $user, Education $education): bool
    {
        return $user->id === $education->user_id;
    }

    public function delete(User $user, Education $education): bool
    {
        return $user->id === $education->user_id;
    }
}

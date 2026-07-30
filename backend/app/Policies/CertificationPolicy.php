<?php

namespace App\Policies;

use App\Models\Certification;
use App\Models\User;

class CertificationPolicy
{
    public function update(User $user, Certification $certification): bool
    {
        return $user->id === $certification->user_id;
    }

    public function delete(User $user, Certification $certification): bool
    {
        return $user->id === $certification->user_id;
    }
}

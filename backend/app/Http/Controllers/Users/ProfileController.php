<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request): User
    {
        return $request->user();
    }

    public function update(Request $request): User
    {
        $user = $request->user();

        $user->update($request->validate([
            'name' => ['required', 'string', 'max:50'],
            'comment' => ['nullable', 'string', 'max:200'],
            'portfolio_url' => ['nullable', 'string', 'url', 'max:255'],
        ]));

        return $user;
    }
}

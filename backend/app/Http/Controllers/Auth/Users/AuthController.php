<?php

namespace App\Http\Controllers\Auth\Users;

use App\Http\Controllers\Auth\ThrottlesLogins;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginUserRequest;
use App\Http\Requests\Auth\RegisterUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ThrottlesLogins;

    public function register(RegisterUserRequest $request): User
    {
        $user = User::create($request->validated());

        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return $user;
    }

    public function login(LoginUserRequest $request): User
    {
        $this->ensureIsNotRateLimited($request, 'users');

        if (! Auth::guard('web')->attempt($request->validated())) {
            $this->hitRateLimiter($request, 'users');

            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        $this->clearRateLimiter($request, 'users');

        $request->session()->regenerate();

        return Auth::guard('web')->user();
    }

    public function logout(Request $request): Response
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }

    public function me(Request $request): User
    {
        return $request->user();
    }
}

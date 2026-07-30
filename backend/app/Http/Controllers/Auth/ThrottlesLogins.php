<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

trait ThrottlesLogins
{
    private const MAX_ATTEMPTS = 5;

    private const DECAY_SECONDS = 60;

    protected function ensureIsNotRateLimited(Request $request, string $guard): void
    {
        $key = $this->throttleKey($request, $guard);

        if (! RateLimiter::tooManyAttempts($key, self::MAX_ATTEMPTS)) {
            return;
        }

        throw ValidationException::withMessages([
            'email' => __('auth.throttle', ['seconds' => RateLimiter::availableIn($key)]),
        ]);
    }

    protected function hitRateLimiter(Request $request, string $guard): void
    {
        RateLimiter::hit($this->throttleKey($request, $guard), self::DECAY_SECONDS);
    }

    protected function clearRateLimiter(Request $request, string $guard): void
    {
        RateLimiter::clear($this->throttleKey($request, $guard));
    }

    private function throttleKey(Request $request, string $guard): string
    {
        return Str::lower((string) $request->input('email'))."|{$guard}|".$request->ip();
    }
}

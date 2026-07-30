<?php

namespace App\Http\Controllers\Auth\Companies;

use App\Http\Controllers\Auth\ThrottlesLogins;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginCompanyRequest;
use App\Http\Requests\Auth\RegisterCompanyRequest;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ThrottlesLogins;

    public function register(RegisterCompanyRequest $request): Company
    {
        $company = Company::create($request->validated());

        Auth::guard('companies')->login($company);
        $request->session()->regenerate();

        return $company;
    }

    public function login(LoginCompanyRequest $request): Company
    {
        $this->ensureIsNotRateLimited($request, 'companies');

        if (! Auth::guard('companies')->attempt($request->validated())) {
            $this->hitRateLimiter($request, 'companies');

            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        $this->clearRateLimiter($request, 'companies');

        $request->session()->regenerate();

        return Auth::guard('companies')->user();
    }

    public function logout(Request $request): Response
    {
        Auth::guard('companies')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }

    public function me(Request $request): Company
    {
        return $request->user();
    }
}

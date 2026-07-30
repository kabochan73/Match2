<?php

namespace App\Http\Controllers\Auth\Companies;

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
    public function register(RegisterCompanyRequest $request): Company
    {
        $company = Company::create($request->validated());

        Auth::guard('companies')->login($company);
        $request->session()->regenerate();

        return $company;
    }

    public function login(LoginCompanyRequest $request): Company
    {
        if (! Auth::guard('companies')->attempt($request->validated())) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

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

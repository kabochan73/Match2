<?php

namespace App\Http\Controllers\Companies;

use App\Enums\Prefecture;
use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function show(Request $request): Company
    {
        return $request->user();
    }

    public function update(Request $request): Company
    {
        $company = $request->user();

        $company->update($request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'prefecture' => ['nullable', Rule::enum(Prefecture::class)],
            'address_line' => ['nullable', 'string', 'max:255'],
        ]));

        return $company;
    }
}

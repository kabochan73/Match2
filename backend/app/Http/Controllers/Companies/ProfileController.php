<?php

namespace App\Http\Controllers\Companies;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;

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
            'prefecture' => ['nullable', 'string', 'max:20'],
            'address_line' => ['nullable', 'string', 'max:255'],
        ]));

        return $company;
    }
}

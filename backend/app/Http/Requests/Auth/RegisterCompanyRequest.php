<?php

namespace App\Http\Requests\Auth;

use App\Enums\Prefecture;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:50'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:companies,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'description' => ['nullable', 'string'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'prefecture' => ['nullable', Rule::enum(Prefecture::class)],
            'address_line' => ['nullable', 'string', 'max:100'],
        ];
    }
}

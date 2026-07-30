<?php

namespace App\Http\Requests\Certifications;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CertificationRequest extends FormRequest
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
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('certifications')
                    ->where('user_id', $this->user()->id)
                    ->ignore($this->route('certification')),
            ],
        ];
    }
}

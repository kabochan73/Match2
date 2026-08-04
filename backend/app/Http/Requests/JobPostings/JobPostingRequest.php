<?php

namespace App\Http\Requests\JobPostings;

use App\Enums\EmploymentType;
use App\Enums\Prefecture;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JobPostingRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'desired_candidate' => ['nullable', 'string'],
            'employment_type' => ['required', Rule::enum(EmploymentType::class)],
            'prefecture' => ['required', Rule::enum(Prefecture::class)],
            'salary_min' => ['nullable', 'integer', 'min:0'],
            'salary_max' => ['nullable', 'integer', 'min:0', 'gte:salary_min'],
        ];
    }
}

<?php

namespace App\Http\Controllers\Companies;

use App\Enums\MemberCountRange;
use App\Enums\Prefecture;
use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Services\RevalidationService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function __construct(private RevalidationService $revalidationService) {}

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
            'founded_year' => ['nullable', 'integer', 'min:1800', 'max:'.(int) date('Y')],
            'member_count_range' => ['nullable', Rule::enum(MemberCountRange::class)],
        ]));

        $this->revalidationService->company($company);

        return $company;
    }
}

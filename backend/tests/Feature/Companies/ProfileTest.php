<?php

use App\Enums\MemberCountRange;
use App\Enums\Prefecture;
use App\Models\Company;

it('returns the authenticated company profile', function () {
    $company = Company::factory()->create();

    $this->actingAs($company, 'companies')
        ->getJson('/api/companies/profile')
        ->assertOk()
        ->assertJsonPath('id', $company->id)
        ->assertJsonPath('email', $company->email);
});

it('rejects guests from viewing the company profile', function () {
    $this->getJson('/api/companies/profile')->assertUnauthorized();
});

it('updates the authenticated company profile', function () {
    $company = Company::factory()->create();

    $this->actingAs($company, 'companies')
        ->putJson('/api/companies/profile', [
            'name' => 'New Company Name',
            'description' => 'Updated description',
            'phone_number' => '03-1234-5678',
            'prefecture' => '大阪',
            'address_line' => '北区1-1-1',
            'founded_year' => 2015,
            'member_count_range' => '11_50',
        ])
        ->assertOk()
        ->assertJsonPath('name', 'New Company Name');

    expect($company->fresh())
        ->name->toBe('New Company Name')
        ->prefecture->toBe(Prefecture::Osaka)
        ->founded_year->toBe(2015)
        ->member_count_range->toBe(MemberCountRange::Range11To50);
});

it('validates the company profile update payload', function () {
    $company = Company::factory()->create();

    $this->actingAs($company, 'companies')
        ->putJson('/api/companies/profile', ['name' => ''])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('name');
});

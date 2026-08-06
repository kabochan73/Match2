<?php

use App\Enums\MemberCountRange;
use App\Enums\Prefecture;
use App\Models\Company;

it('shows a company\'s public profile', function () {
    $company = Company::factory()->create([
        'name' => 'Acme Inc.',
        'email' => 'contact@acme.example.com',
        'description' => '私たちは...',
        'prefecture' => Prefecture::Tokyo,
        'address_line' => '千代田区1-1-1',
        'founded_year' => 2015,
        'member_count_range' => MemberCountRange::Range11To50,
    ]);

    $this->getJson("/api/companies/{$company->id}")
        ->assertOk()
        ->assertJson([
            'id' => $company->id,
            'name' => 'Acme Inc.',
            'email' => 'contact@acme.example.com',
            'description' => '私たちは...',
            'prefecture' => Prefecture::Tokyo->value,
            'address_line' => '千代田区1-1-1',
            'founded_year' => 2015,
            'member_count_range' => MemberCountRange::Range11To50->value,
        ]);
});

it('does not expose the company\'s phone number publicly', function () {
    $company = Company::factory()->create();

    $this->getJson("/api/companies/{$company->id}")
        ->assertOk()
        ->assertJsonMissingPath('phone_number');
});

it('returns 404 for a non-existent company', function () {
    $this->getJson('/api/companies/999999')
        ->assertNotFound();
});

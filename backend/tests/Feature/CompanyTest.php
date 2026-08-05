<?php

use App\Enums\Prefecture;
use App\Models\Company;

it('shows a company\'s public profile', function () {
    $company = Company::factory()->create([
        'name' => 'Acme Inc.',
        'description' => '私たちは...',
        'prefecture' => Prefecture::Tokyo,
        'address_line' => '千代田区1-1-1',
    ]);

    $this->getJson("/api/companies/{$company->id}")
        ->assertOk()
        ->assertJson([
            'id' => $company->id,
            'name' => 'Acme Inc.',
            'description' => '私たちは...',
            'prefecture' => Prefecture::Tokyo->value,
            'address_line' => '千代田区1-1-1',
        ]);
});

it('does not expose the company\'s email or phone number publicly', function () {
    $company = Company::factory()->create();

    $this->getJson("/api/companies/{$company->id}")
        ->assertOk()
        ->assertJsonMissing(['email' => $company->email])
        ->assertJsonMissingPath('phone_number');
});

it('returns 404 for a non-existent company', function () {
    $this->getJson('/api/companies/999999')
        ->assertNotFound();
});

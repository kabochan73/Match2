<?php

use App\Models\Company;
use Illuminate\Support\Facades\RateLimiter;

beforeEach(function () {
    RateLimiter::clear('company@example.com|companies|127.0.0.1');
    $this->withHeader('Referer', config('app.frontend_url'));
});

it('locks out login after too many failed attempts', function () {
    $company = Company::factory()->create(['email' => 'company@example.com']);

    for ($i = 0; $i < 5; $i++) {
        $this->postJson('/api/companies/login', [
            'email' => $company->email,
            'password' => 'wrong-password',
        ])->assertUnprocessable();
    }

    $response = $this->postJson('/api/companies/login', [
        'email' => $company->email,
        'password' => 'password',
    ])->assertUnprocessable();

    expect($response->json('errors.email.0'))->toContain('ログイン試行回数が多すぎます');
});

it('clears the rate limit after a successful login', function () {
    $company = Company::factory()->create(['email' => 'company@example.com']);

    for ($i = 0; $i < 4; $i++) {
        $this->postJson('/api/companies/login', [
            'email' => $company->email,
            'password' => 'wrong-password',
        ])->assertUnprocessable();
    }

    $this->postJson('/api/companies/login', [
        'email' => $company->email,
        'password' => 'password',
    ])->assertOk();

    $this->postJson('/api/companies/logout')->assertNoContent();

    $this->postJson('/api/companies/login', [
        'email' => $company->email,
        'password' => 'wrong-password',
    ])
        ->assertUnprocessable()
        ->assertJsonFragment(['email' => ['メールアドレスまたはパスワードが正しくありません。']]);
});

<?php

use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;

beforeEach(function () {
    RateLimiter::clear('taro@example.com|users|127.0.0.1');
    $this->withHeader('Referer', config('app.frontend_url'));
});

it('locks out login after too many failed attempts', function () {
    $user = User::factory()->create(['email' => 'taro@example.com']);

    for ($i = 0; $i < 5; $i++) {
        $this->postJson('/api/users/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ])->assertUnprocessable();
    }

    $response = $this->postJson('/api/users/login', [
        'email' => $user->email,
        'password' => 'password',
    ])->assertUnprocessable();

    expect($response->json('errors.email.0'))->toContain('ログイン試行回数が多すぎます');
});

it('clears the rate limit after a successful login', function () {
    $user = User::factory()->create(['email' => 'taro@example.com']);

    for ($i = 0; $i < 4; $i++) {
        $this->postJson('/api/users/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ])->assertUnprocessable();
    }

    $this->postJson('/api/users/login', [
        'email' => $user->email,
        'password' => 'password',
    ])->assertOk();

    $this->postJson('/api/users/logout')->assertNoContent();

    $this->postJson('/api/users/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ])
        ->assertUnprocessable()
        ->assertJsonFragment(['email' => ['メールアドレスまたはパスワードが正しくありません。']]);
});

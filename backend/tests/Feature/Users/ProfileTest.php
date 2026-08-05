<?php

use App\Models\User;

it('returns the authenticated user profile', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'web')
        ->getJson('/api/users/profile')
        ->assertOk()
        ->assertJsonPath('id', $user->id)
        ->assertJsonPath('email', $user->email);
});

it('rejects guests from viewing the profile', function () {
    $this->getJson('/api/users/profile')->assertUnauthorized();
});

it('updates the authenticated user profile', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'web')
        ->putJson('/api/users/profile', [
            'name' => 'New Name',
            'comment' => 'Updated comment',
            'portfolio_url' => 'https://example.com/portfolio',
            'birth_date' => '1990-01-01',
        ])
        ->assertOk()
        ->assertJsonPath('name', 'New Name');

    expect($user->fresh())
        ->name->toBe('New Name')
        ->comment->toBe('Updated comment')
        ->portfolio_url->toBe('https://example.com/portfolio')
        ->birth_date->toDateString()->toBe('1990-01-01');
});

it('validates the profile update payload', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'web')
        ->putJson('/api/users/profile', ['name' => ''])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('name');
});

<?php

use App\Models\Certification;
use App\Models\User;

it('lists only the authenticated user\'s certifications', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();

    $user->certifications()->create(['name' => 'AWS SAA']);
    $other->certifications()->create(['name' => 'Other Cert']);

    $this->actingAs($user, 'web')
        ->getJson('/api/users/certifications')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonPath('0.name', 'AWS SAA');
});

it('creates a certification for the authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'web')
        ->postJson('/api/users/certifications', ['name' => 'AWS SAA'])
        ->assertCreated()
        ->assertJsonPath('name', 'AWS SAA');
});

it('rejects duplicate certification names for the same user', function () {
    $user = User::factory()->create();
    $user->certifications()->create(['name' => 'AWS SAA']);

    $this->actingAs($user, 'web')
        ->postJson('/api/users/certifications', ['name' => 'AWS SAA'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('name');
});

it('allows different users to have the same certification name', function () {
    $owner = User::factory()->create();
    $owner->certifications()->create(['name' => 'AWS SAA']);

    $other = User::factory()->create();

    $this->actingAs($other, 'web')
        ->postJson('/api/users/certifications', ['name' => 'AWS SAA'])
        ->assertCreated();
});

it('updates the owner\'s certification', function () {
    $user = User::factory()->create();
    $certification = $user->certifications()->create(['name' => 'Old Cert']);

    $this->actingAs($user, 'web')
        ->putJson("/api/users/certifications/{$certification->id}", ['name' => 'New Cert'])
        ->assertOk()
        ->assertJsonPath('name', 'New Cert');
});

it('allows keeping the same name when updating own certification', function () {
    $user = User::factory()->create();
    $certification = $user->certifications()->create(['name' => 'Same Cert']);

    $this->actingAs($user, 'web')
        ->putJson("/api/users/certifications/{$certification->id}", ['name' => 'Same Cert'])
        ->assertOk();
});

it('forbids updating another user\'s certification', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $certification = $owner->certifications()->create(['name' => 'Old Cert']);

    $this->actingAs($intruder, 'web')
        ->putJson("/api/users/certifications/{$certification->id}", ['name' => 'Hacked'])
        ->assertForbidden();
});

it('deletes the owner\'s certification', function () {
    $user = User::factory()->create();
    $certification = $user->certifications()->create(['name' => 'Old Cert']);

    $this->actingAs($user, 'web')
        ->deleteJson("/api/users/certifications/{$certification->id}")
        ->assertNoContent();

    expect(Certification::find($certification->id))->toBeNull();
});

it('forbids deleting another user\'s certification', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $certification = $owner->certifications()->create(['name' => 'Old Cert']);

    $this->actingAs($intruder, 'web')
        ->deleteJson("/api/users/certifications/{$certification->id}")
        ->assertForbidden();
});

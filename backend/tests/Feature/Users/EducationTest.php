<?php

use App\Models\Education;
use App\Models\User;

it('lists only the authenticated user\'s educations', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();

    $user->educations()->create(['school_name' => 'Own University']);
    $other->educations()->create(['school_name' => 'Other University']);

    $this->actingAs($user, 'web')
        ->getJson('/api/users/educations')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonPath('0.school_name', 'Own University');
});

it('creates an education for the authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'web')
        ->postJson('/api/users/educations', ['school_name' => 'Acme University'])
        ->assertCreated()
        ->assertJsonPath('school_name', 'Acme University');
});

it('updates the owner\'s education', function () {
    $user = User::factory()->create();
    $education = $user->educations()->create(['school_name' => 'Old School']);

    $this->actingAs($user, 'web')
        ->putJson("/api/users/educations/{$education->id}", ['school_name' => 'New School'])
        ->assertOk()
        ->assertJsonPath('school_name', 'New School');
});

it('forbids updating another user\'s education', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $education = $owner->educations()->create(['school_name' => 'Old School']);

    $this->actingAs($intruder, 'web')
        ->putJson("/api/users/educations/{$education->id}", ['school_name' => 'Hacked'])
        ->assertForbidden();
});

it('deletes the owner\'s education', function () {
    $user = User::factory()->create();
    $education = $user->educations()->create(['school_name' => 'Old School']);

    $this->actingAs($user, 'web')
        ->deleteJson("/api/users/educations/{$education->id}")
        ->assertNoContent();

    expect(Education::find($education->id))->toBeNull();
});

it('forbids deleting another user\'s education', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $education = $owner->educations()->create(['school_name' => 'Old School']);

    $this->actingAs($intruder, 'web')
        ->deleteJson("/api/users/educations/{$education->id}")
        ->assertForbidden();
});

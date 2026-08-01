<?php

use App\Models\User;
use App\Models\WorkExperience;

it('lists only the authenticated user\'s work experiences', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();

    $user->workExperiences()->create([
        'company_name' => 'Own Company',
        'started_on' => '2020-01-01',
        'employment_type' => 'full_time',
    ]);
    $other->workExperiences()->create([
        'company_name' => 'Other Company',
        'started_on' => '2020-01-01',
        'employment_type' => 'full_time',
    ]);

    $this->actingAs($user, 'web')
        ->getJson('/api/users/work-experiences')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonPath('0.company_name', 'Own Company');
});

it('creates a work experience for the authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'web')
        ->postJson('/api/users/work-experiences', [
            'company_name' => 'Acme Inc',
            'started_on' => '2020-04-01',
            'ended_on' => '2023-03-31',
            'employment_type' => 'full_time',
        ])
        ->assertCreated()
        ->assertJsonPath('company_name', 'Acme Inc');

    expect($user->workExperiences()->count())->toBe(1);
});

it('rejects an end date before the start date', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'web')
        ->postJson('/api/users/work-experiences', [
            'company_name' => 'Acme Inc',
            'started_on' => '2020-04-01',
            'ended_on' => '2019-01-01',
            'employment_type' => 'full_time',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('ended_on');
});

it('updates the owner\'s work experience', function () {
    $user = User::factory()->create();
    $workExperience = $user->workExperiences()->create([
        'company_name' => 'Old Company',
        'started_on' => '2020-01-01',
        'employment_type' => 'full_time',
    ]);

    $this->actingAs($user, 'web')
        ->putJson("/api/users/work-experiences/{$workExperience->id}", [
            'company_name' => 'New Company',
            'started_on' => '2020-01-01',
            'employment_type' => 'contract',
        ])
        ->assertOk()
        ->assertJsonPath('company_name', 'New Company');
});

it('forbids updating another user\'s work experience', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $workExperience = $owner->workExperiences()->create([
        'company_name' => 'Old Company',
        'started_on' => '2020-01-01',
        'employment_type' => 'full_time',
    ]);

    $this->actingAs($intruder, 'web')
        ->putJson("/api/users/work-experiences/{$workExperience->id}", [
            'company_name' => 'Hacked',
            'started_on' => '2020-01-01',
            'employment_type' => 'contract',
        ])
        ->assertForbidden();
});

it('forbids deleting another user\'s work experience', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $workExperience = $owner->workExperiences()->create([
        'company_name' => 'Old Company',
        'started_on' => '2020-01-01',
        'employment_type' => 'full_time',
    ]);

    $this->actingAs($intruder, 'web')
        ->deleteJson("/api/users/work-experiences/{$workExperience->id}")
        ->assertForbidden();

    expect(WorkExperience::find($workExperience->id))->not->toBeNull();
});

it('deletes the owner\'s work experience', function () {
    $user = User::factory()->create();
    $workExperience = $user->workExperiences()->create([
        'company_name' => 'Old Company',
        'started_on' => '2020-01-01',
        'employment_type' => 'full_time',
    ]);

    $this->actingAs($user, 'web')
        ->deleteJson("/api/users/work-experiences/{$workExperience->id}")
        ->assertNoContent();

    expect(WorkExperience::find($workExperience->id))->toBeNull();
});

<?php

use App\Enums\ApplicationStatus;
use App\Models\Application;
use App\Models\JobPosting;
use App\Models\User;

it('lists only the authenticated user\'s applications', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();

    Application::factory()->for($user)->create();
    Application::factory()->for($other)->create();

    $this->actingAs($user, 'web')
        ->getJson('/api/users/applications')
        ->assertOk()
        ->assertJsonCount(1);
});

it('creates an application for a published job posting', function () {
    $user = User::factory()->create();
    $jobPosting = JobPosting::factory()->published()->create();

    $this->actingAs($user, 'web')
        ->postJson('/api/users/applications', [
            'job_posting_id' => $jobPosting->id,
            'like_type' => 'standard',
            'motivation' => '御社のプロダクトに魅力を感じ応募しました。',
        ])
        ->assertCreated()
        ->assertJsonPath('status', ApplicationStatus::Applied->value)
        ->assertJsonPath('motivation', '御社のプロダクトに魅力を感じ応募しました。');
});

it('rejects an application without a motivation', function () {
    $user = User::factory()->create();
    $jobPosting = JobPosting::factory()->published()->create();

    $this->actingAs($user, 'web')
        ->postJson('/api/users/applications', [
            'job_posting_id' => $jobPosting->id,
            'like_type' => 'standard',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('motivation');
});

it('rejects applying to a non-published job posting', function () {
    $user = User::factory()->create();
    $jobPosting = JobPosting::factory()->create();

    $this->actingAs($user, 'web')
        ->postJson('/api/users/applications', [
            'job_posting_id' => $jobPosting->id,
            'like_type' => 'standard',
            'motivation' => '志望動機です。',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('job_posting_id');
});

it('rejects a duplicate application to the same job posting', function () {
    $user = User::factory()->create();
    $jobPosting = JobPosting::factory()->published()->create();
    Application::factory()->for($user)->for($jobPosting)->create();

    $this->actingAs($user, 'web')
        ->postJson('/api/users/applications', [
            'job_posting_id' => $jobPosting->id,
            'like_type' => 'standard',
            'motivation' => '志望動機です。',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('job_posting_id');
});

it('rejects the 11th standard like within the same month', function () {
    $user = User::factory()->create();

    Application::factory()->for($user)->count(10)->create();

    $jobPosting = JobPosting::factory()->published()->create();

    $this->actingAs($user, 'web')
        ->postJson('/api/users/applications', [
            'job_posting_id' => $jobPosting->id,
            'like_type' => 'standard',
            'motivation' => '志望動機です。',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('like_type');
});

it('rejects the 2nd super like within the same month', function () {
    $user = User::factory()->create();

    Application::factory()->for($user)->super()->create();

    $jobPosting = JobPosting::factory()->published()->create();

    $this->actingAs($user, 'web')
        ->postJson('/api/users/applications', [
            'job_posting_id' => $jobPosting->id,
            'like_type' => 'super',
            'motivation' => '志望動機です。',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('like_type');
});

it('allows a standard like even when the super like limit is reached', function () {
    $user = User::factory()->create();

    Application::factory()->for($user)->super()->create();

    $jobPosting = JobPosting::factory()->published()->create();

    $this->actingAs($user, 'web')
        ->postJson('/api/users/applications', [
            'job_posting_id' => $jobPosting->id,
            'like_type' => 'standard',
            'motivation' => '志望動機です。',
        ])
        ->assertCreated();
});

it('forbids viewing another user\'s application', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $application = Application::factory()->for($owner)->create();

    $this->actingAs($intruder, 'web')
        ->getJson("/api/users/applications/{$application->id}")
        ->assertForbidden();
});

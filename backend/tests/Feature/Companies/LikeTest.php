<?php

use App\Enums\LikeStatus;
use App\Models\Company;
use App\Models\JobPosting;
use App\Models\Like;

it('lists only likes for the authenticated company\'s job postings', function () {
    $company = Company::factory()->create();
    $other = Company::factory()->create();

    $ownJobPosting = JobPosting::factory()->for($company)->create();
    $otherJobPosting = JobPosting::factory()->for($other)->create();

    Like::factory()->for($ownJobPosting)->create();
    Like::factory()->for($otherJobPosting)->create();

    $this->actingAs($company, 'companies')
        ->getJson('/api/companies/likes')
        ->assertOk()
        ->assertJsonCount(1);
});

it('shows the applicant profile including career details', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();
    $like = Like::factory()->for($jobPosting)->create();
    $like->user->workExperiences()->create([
        'company_name' => 'Acme',
        'started_on' => '2020-01-01',
        'employment_type' => 'full_time',
    ]);

    $this->actingAs($company, 'companies')
        ->getJson("/api/companies/likes/{$like->id}")
        ->assertOk()
        ->assertJsonCount(1, 'user.work_experiences');
});

it('forbids viewing a like for another company\'s job posting', function () {
    $owner = Company::factory()->create();
    $intruder = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($owner)->create();
    $like = Like::factory()->for($jobPosting)->create();

    $this->actingAs($intruder, 'companies')
        ->getJson("/api/companies/likes/{$like->id}")
        ->assertForbidden();
});

it('matches a like within the response deadline', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();
    $like = Like::factory()->for($jobPosting)->create();

    $this->actingAs($company, 'companies')
        ->patchJson("/api/companies/likes/{$like->id}/match")
        ->assertOk()
        ->assertJsonPath('status', LikeStatus::Matched->value);

    expect($like->fresh()->company_responded_at)->not->toBeNull();
});

it('rejects matching after the response deadline has passed', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();
    $like = Like::factory()->for($jobPosting)->create([
        'applied_at' => now()->subDays(10),
        'response_deadline' => now()->subDays(3),
    ]);

    $this->actingAs($company, 'companies')
        ->patchJson("/api/companies/likes/{$like->id}/match")
        ->assertUnprocessable();
});

it('rejects matching an already matched like', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();
    $like = Like::factory()->matched()->for($jobPosting)->create();

    $this->actingAs($company, 'companies')
        ->patchJson("/api/companies/likes/{$like->id}/match")
        ->assertUnprocessable();
});

it('forbids matching a like for another company\'s job posting', function () {
    $owner = Company::factory()->create();
    $intruder = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($owner)->create();
    $like = Like::factory()->for($jobPosting)->create();

    $this->actingAs($intruder, 'companies')
        ->patchJson("/api/companies/likes/{$like->id}/match")
        ->assertForbidden();
});

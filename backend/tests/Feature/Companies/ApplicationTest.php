<?php

use App\Enums\ApplicationStatus;
use App\Models\Application;
use App\Models\Company;
use App\Models\JobPosting;

it('lists only applications for the authenticated company\'s job postings', function () {
    $company = Company::factory()->create();
    $other = Company::factory()->create();

    $ownJobPosting = JobPosting::factory()->for($company)->create();
    $otherJobPosting = JobPosting::factory()->for($other)->create();

    Application::factory()->for($ownJobPosting)->create();
    Application::factory()->for($otherJobPosting)->create();

    $this->actingAs($company, 'companies')
        ->getJson('/api/companies/applications')
        ->assertOk()
        ->assertJsonCount(1);
});

it('shows the applicant profile including career details', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();
    $application = Application::factory()->for($jobPosting)->create();
    $application->user->workExperiences()->create([
        'company_name' => 'Acme',
        'started_on' => '2020-01-01',
        'employment_type' => 'full_time',
    ]);

    $this->actingAs($company, 'companies')
        ->getJson("/api/companies/applications/{$application->id}")
        ->assertOk()
        ->assertJsonCount(1, 'user.work_experiences');
});

it('forbids viewing an application for another company\'s job posting', function () {
    $owner = Company::factory()->create();
    $intruder = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($owner)->create();
    $application = Application::factory()->for($jobPosting)->create();

    $this->actingAs($intruder, 'companies')
        ->getJson("/api/companies/applications/{$application->id}")
        ->assertForbidden();
});

it('matches an application within the response deadline', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();
    $application = Application::factory()->for($jobPosting)->create();

    $this->actingAs($company, 'companies')
        ->patchJson("/api/companies/applications/{$application->id}/match")
        ->assertOk()
        ->assertJsonPath('status', ApplicationStatus::Matched->value);

    expect($application->fresh()->company_responded_at)->not->toBeNull();
});

it('rejects matching after the response deadline has passed', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();
    $application = Application::factory()->for($jobPosting)->create([
        'applied_at' => now()->subDays(10),
        'response_deadline' => now()->subDays(3),
    ]);

    $this->actingAs($company, 'companies')
        ->patchJson("/api/companies/applications/{$application->id}/match")
        ->assertUnprocessable();
});

it('rejects matching an already matched application', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();
    $application = Application::factory()->matched()->for($jobPosting)->create();

    $this->actingAs($company, 'companies')
        ->patchJson("/api/companies/applications/{$application->id}/match")
        ->assertUnprocessable();
});

it('forbids matching an application for another company\'s job posting', function () {
    $owner = Company::factory()->create();
    $intruder = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($owner)->create();
    $application = Application::factory()->for($jobPosting)->create();

    $this->actingAs($intruder, 'companies')
        ->patchJson("/api/companies/applications/{$application->id}/match")
        ->assertForbidden();
});

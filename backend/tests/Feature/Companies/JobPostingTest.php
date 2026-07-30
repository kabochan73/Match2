<?php

use App\Enums\JobPostingStatus;
use App\Models\Company;
use App\Models\JobPosting;

it('lists only the authenticated company\'s job postings', function () {
    $company = Company::factory()->create();
    $other = Company::factory()->create();

    JobPosting::factory()->for($company)->create(['title' => 'Own Job']);
    JobPosting::factory()->for($other)->create(['title' => 'Other Job']);

    $this->actingAs($company, 'companies')
        ->getJson('/api/companies/job-postings')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonPath('0.title', 'Own Job');
});

it('creates a job posting as draft for the authenticated company', function () {
    $company = Company::factory()->create();

    $this->actingAs($company, 'companies')
        ->postJson('/api/companies/job-postings', [
            'title' => 'Backend Engineer',
            'description' => 'Build things.',
            'desired_candidate' => 'PHP experience.',
            'employment_type' => 'full_time',
            'prefecture' => '東京都',
            'salary_min' => 400000,
            'salary_max' => 600000,
        ])
        ->assertCreated()
        ->assertJsonPath('title', 'Backend Engineer')
        ->assertJsonPath('status', JobPostingStatus::Draft->value);
});

it('rejects a salary_max lower than salary_min', function () {
    $company = Company::factory()->create();

    $this->actingAs($company, 'companies')
        ->postJson('/api/companies/job-postings', [
            'title' => 'Backend Engineer',
            'description' => 'Build things.',
            'employment_type' => 'full_time',
            'prefecture' => '東京都',
            'salary_min' => 600000,
            'salary_max' => 400000,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('salary_max');
});

it('forbids viewing another company\'s job posting', function () {
    $owner = Company::factory()->create();
    $intruder = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($owner)->create();

    $this->actingAs($intruder, 'companies')
        ->getJson("/api/companies/job-postings/{$jobPosting->id}")
        ->assertForbidden();
});

it('forbids updating another company\'s job posting', function () {
    $owner = Company::factory()->create();
    $intruder = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($owner)->create();

    $this->actingAs($intruder, 'companies')
        ->putJson("/api/companies/job-postings/{$jobPosting->id}", [
            'title' => 'Hacked',
            'description' => 'Hacked.',
            'employment_type' => 'full_time',
            'prefecture' => '東京都',
        ])
        ->assertForbidden();
});

it('publishes a draft job posting', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();

    $this->actingAs($company, 'companies')
        ->patchJson("/api/companies/job-postings/{$jobPosting->id}/publish")
        ->assertOk()
        ->assertJsonPath('status', JobPostingStatus::Published->value);

    expect($jobPosting->fresh()->published_at)->not->toBeNull();
});

it('rejects publishing a non-draft job posting', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->published()->for($company)->create();

    $this->actingAs($company, 'companies')
        ->patchJson("/api/companies/job-postings/{$jobPosting->id}/publish")
        ->assertUnprocessable();
});

it('closes a published job posting', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->published()->for($company)->create();

    $this->actingAs($company, 'companies')
        ->patchJson("/api/companies/job-postings/{$jobPosting->id}/close")
        ->assertOk()
        ->assertJsonPath('status', JobPostingStatus::Closed->value);
});

it('rejects closing a draft job posting', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();

    $this->actingAs($company, 'companies')
        ->patchJson("/api/companies/job-postings/{$jobPosting->id}/close")
        ->assertUnprocessable();
});

it('forbids publishing another company\'s job posting', function () {
    $owner = Company::factory()->create();
    $intruder = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($owner)->create();

    $this->actingAs($intruder, 'companies')
        ->patchJson("/api/companies/job-postings/{$jobPosting->id}/publish")
        ->assertForbidden();
});

it('deletes the owner\'s job posting', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();

    $this->actingAs($company, 'companies')
        ->deleteJson("/api/companies/job-postings/{$jobPosting->id}")
        ->assertNoContent();

    expect(JobPosting::find($jobPosting->id))->toBeNull();
});

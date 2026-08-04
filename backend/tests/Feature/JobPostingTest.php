<?php

use App\Models\Company;
use App\Models\JobPosting;

it('lists only published job postings', function () {
    JobPosting::factory()->published()->create(['title' => 'Published Job']);
    JobPosting::factory()->create(['title' => 'Draft Job']);

    $this->getJson('/api/job-postings')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.title', 'Published Job');
});

it('includes the company name on each job posting', function () {
    $company = Company::factory()->create(['name' => 'Acme Inc.']);
    JobPosting::factory()->published()->for($company)->create();

    $this->getJson('/api/job-postings')
        ->assertOk()
        ->assertJsonPath('data.0.company.name', 'Acme Inc.');
});

it('paginates job postings', function () {
    JobPosting::factory()->published()->count(35)->create();

    $this->getJson('/api/job-postings')
        ->assertOk()
        ->assertJsonCount(30, 'data')
        ->assertJsonPath('meta.current_page', 1)
        ->assertJsonPath('meta.last_page', 2)
        ->assertJsonPath('meta.total', 35);

    $this->getJson('/api/job-postings?page=2')
        ->assertOk()
        ->assertJsonCount(5, 'data')
        ->assertJsonPath('meta.current_page', 2);
});

it('filters job postings by keyword', function () {
    JobPosting::factory()->published()->create(['title' => 'Backend Engineer', 'description' => 'PHP work']);
    JobPosting::factory()->published()->create(['title' => 'Designer', 'description' => 'Figma work']);

    $this->getJson('/api/job-postings?keyword=Backend')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.title', 'Backend Engineer');
});

it('filters job postings by prefecture and employment_type', function () {
    JobPosting::factory()->published()->create([
        'prefecture' => '東京',
        'employment_type' => 'full_time',
    ]);
    JobPosting::factory()->published()->create([
        'prefecture' => '大阪',
        'employment_type' => 'contract',
    ]);

    $query = http_build_query(['prefecture' => '東京', 'employment_type' => 'full_time']);

    $this->getJson("/api/job-postings?{$query}")
        ->assertOk()
        ->assertJsonCount(1, 'data');
});

it('allows guests to view job postings without authentication', function () {
    JobPosting::factory()->published()->create();

    $this->getJson('/api/job-postings')->assertOk();
});

it('shows a published job posting', function () {
    $company = Company::factory()->create(['name' => 'Acme Inc.']);
    $jobPosting = JobPosting::factory()->published()->for($company)->create();

    $this->getJson("/api/job-postings/{$jobPosting->id}")
        ->assertOk()
        ->assertJsonPath('id', $jobPosting->id)
        ->assertJsonPath('company.name', 'Acme Inc.');
});

it('returns 404 for a non-published job posting', function () {
    $jobPosting = JobPosting::factory()->create();

    $this->getJson("/api/job-postings/{$jobPosting->id}")
        ->assertNotFound();
});

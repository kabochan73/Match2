<?php

use App\Models\JobPosting;

it('lists only published job postings', function () {
    JobPosting::factory()->published()->create(['title' => 'Published Job']);
    JobPosting::factory()->create(['title' => 'Draft Job']);

    $this->getJson('/api/job-postings')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonPath('0.title', 'Published Job');
});

it('filters job postings by keyword', function () {
    JobPosting::factory()->published()->create(['title' => 'Backend Engineer', 'description' => 'PHP work']);
    JobPosting::factory()->published()->create(['title' => 'Designer', 'description' => 'Figma work']);

    $this->getJson('/api/job-postings?keyword=Backend')
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonPath('0.title', 'Backend Engineer');
});

it('filters job postings by prefecture and employment_type', function () {
    JobPosting::factory()->published()->create([
        'prefecture' => '東京都',
        'employment_type' => 'full_time',
    ]);
    JobPosting::factory()->published()->create([
        'prefecture' => '大阪府',
        'employment_type' => 'contract',
    ]);

    $query = http_build_query(['prefecture' => '東京都', 'employment_type' => 'full_time']);

    $this->getJson("/api/job-postings?{$query}")
        ->assertOk()
        ->assertJsonCount(1);
});

it('allows guests to view job postings without authentication', function () {
    JobPosting::factory()->published()->create();

    $this->getJson('/api/job-postings')->assertOk();
});

it('shows a published job posting', function () {
    $jobPosting = JobPosting::factory()->published()->create();

    $this->getJson("/api/job-postings/{$jobPosting->id}")
        ->assertOk()
        ->assertJsonPath('id', $jobPosting->id);
});

it('returns 404 for a non-published job posting', function () {
    $jobPosting = JobPosting::factory()->create();

    $this->getJson("/api/job-postings/{$jobPosting->id}")
        ->assertNotFound();
});

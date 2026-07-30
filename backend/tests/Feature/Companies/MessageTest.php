<?php

use App\Models\Application;
use App\Models\Company;
use App\Models\JobPosting;

it('sends a message on a matched application', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();
    $application = Application::factory()->matched()->for($jobPosting)->create();

    $this->actingAs($company, 'companies')
        ->postJson("/api/companies/applications/{$application->id}/messages", ['body' => 'ご応募ありがとうございます'])
        ->assertCreated()
        ->assertJsonPath('sender_type', 'company');
});

it('rejects sending a message on a non-matched application', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();
    $application = Application::factory()->for($jobPosting)->create();

    $this->actingAs($company, 'companies')
        ->postJson("/api/companies/applications/{$application->id}/messages", ['body' => 'こんにちは'])
        ->assertUnprocessable();
});

it('forbids sending a message on another company\'s job posting application', function () {
    $owner = Company::factory()->create();
    $intruder = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($owner)->create();
    $application = Application::factory()->matched()->for($jobPosting)->create();

    $this->actingAs($intruder, 'companies')
        ->postJson("/api/companies/applications/{$application->id}/messages", ['body' => 'なりすまし'])
        ->assertForbidden();
});

it('marks the user\'s messages as read when the company views the thread', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();
    $application = Application::factory()->matched()->for($jobPosting)->create();

    $userMessage = $application->messages()->create([
        'sender_type' => 'user',
        'sender_id' => $application->user_id,
        'body' => 'メッセージ',
    ]);

    $this->actingAs($company, 'companies')
        ->getJson("/api/companies/applications/{$application->id}/messages")
        ->assertOk()
        ->assertJsonCount(1);

    expect($userMessage->fresh()->read_at)->not->toBeNull();
});

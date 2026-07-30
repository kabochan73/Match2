<?php

use App\Models\Company;
use App\Models\JobPosting;
use App\Models\Like;

it('sends a message on a matched like', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();
    $like = Like::factory()->matched()->for($jobPosting)->create();

    $this->actingAs($company, 'companies')
        ->postJson("/api/companies/likes/{$like->id}/messages", ['body' => 'ご応募ありがとうございます'])
        ->assertCreated()
        ->assertJsonPath('sender_type', 'company');
});

it('rejects sending a message on a non-matched like', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();
    $like = Like::factory()->for($jobPosting)->create();

    $this->actingAs($company, 'companies')
        ->postJson("/api/companies/likes/{$like->id}/messages", ['body' => 'こんにちは'])
        ->assertUnprocessable();
});

it('forbids sending a message on another company\'s job posting like', function () {
    $owner = Company::factory()->create();
    $intruder = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($owner)->create();
    $like = Like::factory()->matched()->for($jobPosting)->create();

    $this->actingAs($intruder, 'companies')
        ->postJson("/api/companies/likes/{$like->id}/messages", ['body' => 'なりすまし'])
        ->assertForbidden();
});

it('marks the user\'s messages as read when the company views the thread', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();
    $like = Like::factory()->matched()->for($jobPosting)->create();

    $userMessage = $like->messages()->create([
        'sender_type' => 'user',
        'sender_id' => $like->user_id,
        'body' => 'メッセージ',
    ]);

    $this->actingAs($company, 'companies')
        ->getJson("/api/companies/likes/{$like->id}/messages")
        ->assertOk()
        ->assertJsonCount(1);

    expect($userMessage->fresh()->read_at)->not->toBeNull();
});

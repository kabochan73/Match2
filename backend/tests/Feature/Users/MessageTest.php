<?php

use App\Models\Company;
use App\Models\JobPosting;
use App\Models\Like;
use App\Models\User;

it('sends a message on a matched like', function () {
    $user = User::factory()->create();
    $like = Like::factory()->matched()->for($user)->create();

    $this->actingAs($user, 'web')
        ->postJson("/api/users/likes/{$like->id}/messages", ['body' => 'よろしくお願いします'])
        ->assertCreated()
        ->assertJsonPath('body', 'よろしくお願いします')
        ->assertJsonPath('sender_type', 'user');
});

it('rejects sending a message on a non-matched like', function () {
    $user = User::factory()->create();
    $like = Like::factory()->for($user)->create();

    $this->actingAs($user, 'web')
        ->postJson("/api/users/likes/{$like->id}/messages", ['body' => 'こんにちは'])
        ->assertUnprocessable();
});

it('forbids sending a message on another user\'s like', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $like = Like::factory()->matched()->for($owner)->create();

    $this->actingAs($intruder, 'web')
        ->postJson("/api/users/likes/{$like->id}/messages", ['body' => 'なりすまし'])
        ->assertForbidden();
});

it('lists messages in chronological order and marks the company\'s messages as read', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();
    $user = User::factory()->create();
    $like = Like::factory()->matched()->for($user)->for($jobPosting)->create();

    $companyMessage = $like->messages()->create([
        'sender_type' => 'company',
        'sender_id' => $company->id,
        'body' => '最初のメッセージ',
    ]);
    $userMessage = $like->messages()->create([
        'sender_type' => 'user',
        'sender_id' => $user->id,
        'body' => '2件目のメッセージ',
    ]);

    $this->actingAs($user, 'web')
        ->getJson("/api/users/likes/{$like->id}/messages")
        ->assertOk()
        ->assertJsonPath('0.body', '最初のメッセージ')
        ->assertJsonPath('1.body', '2件目のメッセージ');

    expect($companyMessage->fresh()->read_at)->not->toBeNull();
});

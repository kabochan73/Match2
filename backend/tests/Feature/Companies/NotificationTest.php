<?php

use App\Models\Company;
use App\Models\JobPosting;
use App\Models\Like;
use App\Models\User;
use App\Notifications\NewLikeReceived;
use App\Notifications\NewMessageReceived;
use Illuminate\Support\Facades\Notification;

it('notifies the company when a job posting receives a new like', function () {
    Notification::fake();

    $user = User::factory()->create();
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->published()->for($company)->create();

    $this->actingAs($user, 'web')
        ->postJson('/api/users/likes', [
            'job_posting_id' => $jobPosting->id,
            'like_type' => 'standard',
            'motivation' => '志望動機です。',
        ])
        ->assertCreated();

    Notification::assertSentTo($company, NewLikeReceived::class);
});

it('notifies the company when the user sends a message', function () {
    Notification::fake();

    $user = User::factory()->create();
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();
    $like = Like::factory()->matched()->for($user)->for($jobPosting)->create();

    $this->actingAs($user, 'web')
        ->postJson("/api/users/likes/{$like->id}/messages", ['body' => 'よろしくお願いします'])
        ->assertCreated();

    Notification::assertSentTo($company, NewMessageReceived::class);
});

it('lists the authenticated company\'s notifications', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();
    $like = Like::factory()->for($jobPosting)->create();
    $company->notify(new NewLikeReceived($like));

    $this->actingAs($company, 'companies')
        ->getJson('/api/companies/notifications')
        ->assertOk()
        ->assertJsonCount(1);
});

it('marks a notification as read', function () {
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();
    $like = Like::factory()->for($jobPosting)->create();
    $company->notify(new NewLikeReceived($like));
    $notification = $company->notifications()->first();

    $this->actingAs($company, 'companies')
        ->patchJson("/api/companies/notifications/{$notification->id}/read")
        ->assertOk();

    expect($notification->fresh()->read_at)->not->toBeNull();
});

it('returns 404 for another company\'s notification', function () {
    $owner = Company::factory()->create();
    $intruder = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($owner)->create();
    $like = Like::factory()->for($jobPosting)->create();
    $owner->notify(new NewLikeReceived($like));
    $notification = $owner->notifications()->first();

    $this->actingAs($intruder, 'companies')
        ->patchJson("/api/companies/notifications/{$notification->id}/read")
        ->assertNotFound();
});

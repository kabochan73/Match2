<?php

use App\Models\Company;
use App\Models\JobPosting;
use App\Models\Like;
use App\Models\User;
use App\Notifications\LikeExpired;
use App\Notifications\LikeMatched;
use App\Notifications\NewMessageReceived;
use Illuminate\Support\Facades\Notification;

it('notifies the user when their like is matched', function () {
    Notification::fake();

    $user = User::factory()->create();
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();
    $like = Like::factory()->for($user)->for($jobPosting)->create();

    $this->actingAs($company, 'companies')
        ->patchJson("/api/companies/likes/{$like->id}/match")
        ->assertOk();

    Notification::assertSentTo($user, LikeMatched::class);
});

it('notifies the user when their like expires', function () {
    Notification::fake();

    $user = User::factory()->create();
    Like::factory()->for($user)->create([
        'applied_at' => now()->subDays(10),
        'response_deadline' => now()->subDays(3),
    ]);

    $this->artisan('likes:expire');

    Notification::assertSentTo($user, LikeExpired::class);
});

it('notifies the user when the company sends a message', function () {
    Notification::fake();

    $user = User::factory()->create();
    $company = Company::factory()->create();
    $jobPosting = JobPosting::factory()->for($company)->create();
    $like = Like::factory()->matched()->for($user)->for($jobPosting)->create();

    $this->actingAs($company, 'companies')
        ->postJson("/api/companies/likes/{$like->id}/messages", ['body' => 'こんにちは'])
        ->assertCreated();

    Notification::assertSentTo($user, NewMessageReceived::class);
});

it('lists the authenticated user\'s notifications', function () {
    $user = User::factory()->create();
    $like = Like::factory()->for($user)->create();
    $user->notify(new LikeMatched($like));

    $this->actingAs($user, 'web')
        ->getJson('/api/users/notifications')
        ->assertOk()
        ->assertJsonCount(1);
});

it('marks a notification as read', function () {
    $user = User::factory()->create();
    $like = Like::factory()->for($user)->create();
    $user->notify(new LikeMatched($like));
    $notification = $user->notifications()->first();

    $this->actingAs($user, 'web')
        ->patchJson("/api/users/notifications/{$notification->id}/read")
        ->assertOk();

    expect($notification->fresh()->read_at)->not->toBeNull();
});

it('returns 404 for another user\'s notification', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $like = Like::factory()->for($owner)->create();
    $owner->notify(new LikeMatched($like));
    $notification = $owner->notifications()->first();

    $this->actingAs($intruder, 'web')
        ->patchJson("/api/users/notifications/{$notification->id}/read")
        ->assertNotFound();
});

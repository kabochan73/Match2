<?php

use App\Enums\LikeStatus;
use App\Models\Like;

it('expires applied likes past their response deadline', function () {
    $overdue = Like::factory()->create([
        'applied_at' => now()->subDays(10),
        'response_deadline' => now()->subDays(3),
    ]);

    $this->artisan('likes:expire')->assertSuccessful();

    expect($overdue->fresh()->status)->toBe(LikeStatus::Expired);
});

it('does not expire applied likes still within the deadline', function () {
    $withinDeadline = Like::factory()->create([
        'applied_at' => now(),
        'response_deadline' => now()->addDays(7),
    ]);

    $this->artisan('likes:expire');

    expect($withinDeadline->fresh()->status)->toBe(LikeStatus::Applied);
});

it('does not touch already matched likes', function () {
    $matched = Like::factory()->matched()->create([
        'applied_at' => now()->subDays(10),
        'response_deadline' => now()->subDays(3),
    ]);

    $this->artisan('likes:expire');

    expect($matched->fresh()->status)->toBe(LikeStatus::Matched);
});

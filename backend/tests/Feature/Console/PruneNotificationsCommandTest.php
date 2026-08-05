<?php

use App\Models\Like;
use App\Models\User;
use App\Notifications\LikeMatched;

it('deletes notifications older than 30 days', function () {
    $user = User::factory()->create();
    $like = Like::factory()->for($user)->create();
    $user->notify(new LikeMatched($like));
    $user->notifications()->first()->update(['created_at' => now()->subDays(31)]);

    $this->artisan('notifications:prune')->assertSuccessful();

    expect($user->notifications()->count())->toBe(0);
});

it('keeps notifications within the last 30 days', function () {
    $user = User::factory()->create();
    $like = Like::factory()->for($user)->create();
    $user->notify(new LikeMatched($like));
    $user->notifications()->first()->update(['created_at' => now()->subDays(29)]);

    $this->artisan('notifications:prune');

    expect($user->notifications()->count())->toBe(1);
});

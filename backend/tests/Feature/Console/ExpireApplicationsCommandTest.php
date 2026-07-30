<?php

use App\Enums\ApplicationStatus;
use App\Models\Application;

it('expires applied applications past their response deadline', function () {
    $overdue = Application::factory()->create([
        'applied_at' => now()->subDays(10),
        'response_deadline' => now()->subDays(3),
    ]);

    $this->artisan('applications:expire')->assertSuccessful();

    expect($overdue->fresh()->status)->toBe(ApplicationStatus::Expired);
});

it('does not expire applied applications still within the deadline', function () {
    $withinDeadline = Application::factory()->create([
        'applied_at' => now(),
        'response_deadline' => now()->addDays(7),
    ]);

    $this->artisan('applications:expire');

    expect($withinDeadline->fresh()->status)->toBe(ApplicationStatus::Applied);
});

it('does not touch already matched applications', function () {
    $matched = Application::factory()->matched()->create([
        'applied_at' => now()->subDays(10),
        'response_deadline' => now()->subDays(3),
    ]);

    $this->artisan('applications:expire');

    expect($matched->fresh()->status)->toBe(ApplicationStatus::Matched);
});

<?php

use App\Enums\LikeStatus;
use App\Models\JobPosting;
use App\Models\Like;
use App\Models\User;

it('lists only the authenticated user\'s likes', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();

    Like::factory()->for($user)->create();
    Like::factory()->for($other)->create();

    $this->actingAs($user, 'web')
        ->getJson('/api/users/likes')
        ->assertOk()
        ->assertJsonCount(1);
});

it('creates a like for a published job posting', function () {
    $user = User::factory()->create();
    $jobPosting = JobPosting::factory()->published()->create();

    $this->actingAs($user, 'web')
        ->postJson('/api/users/likes', [
            'job_posting_id' => $jobPosting->id,
            'like_type' => 'standard',
            'motivation' => '御社のプロダクトに魅力を感じ応募しました。',
        ])
        ->assertCreated()
        ->assertJsonPath('status', LikeStatus::Applied->value)
        ->assertJsonPath('motivation', '御社のプロダクトに魅力を感じ応募しました。');
});

it('rejects a like without a motivation', function () {
    $user = User::factory()->create();
    $jobPosting = JobPosting::factory()->published()->create();

    $this->actingAs($user, 'web')
        ->postJson('/api/users/likes', [
            'job_posting_id' => $jobPosting->id,
            'like_type' => 'standard',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('motivation');
});

it('rejects liking a non-published job posting', function () {
    $user = User::factory()->create();
    $jobPosting = JobPosting::factory()->create();

    $this->actingAs($user, 'web')
        ->postJson('/api/users/likes', [
            'job_posting_id' => $jobPosting->id,
            'like_type' => 'standard',
            'motivation' => '志望動機です。',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('job_posting_id');
});

it('rejects a duplicate like on the same job posting', function () {
    $user = User::factory()->create();
    $jobPosting = JobPosting::factory()->published()->create();
    Like::factory()->for($user)->for($jobPosting)->create();

    $this->actingAs($user, 'web')
        ->postJson('/api/users/likes', [
            'job_posting_id' => $jobPosting->id,
            'like_type' => 'standard',
            'motivation' => '志望動機です。',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('job_posting_id');
});

it('rejects the 11th standard like within the same month', function () {
    $user = User::factory()->create();

    Like::factory()->for($user)->count(10)->create();

    $jobPosting = JobPosting::factory()->published()->create();

    $this->actingAs($user, 'web')
        ->postJson('/api/users/likes', [
            'job_posting_id' => $jobPosting->id,
            'like_type' => 'standard',
            'motivation' => '志望動機です。',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('like_type');
});

it('rejects the 2nd super like within the same month', function () {
    $user = User::factory()->create();

    Like::factory()->for($user)->super()->create();

    $jobPosting = JobPosting::factory()->published()->create();

    $this->actingAs($user, 'web')
        ->postJson('/api/users/likes', [
            'job_posting_id' => $jobPosting->id,
            'like_type' => 'super',
            'motivation' => '志望動機です。',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('like_type');
});

it('allows a standard like even when the super like limit is reached', function () {
    $user = User::factory()->create();

    Like::factory()->for($user)->super()->create();

    $jobPosting = JobPosting::factory()->published()->create();

    $this->actingAs($user, 'web')
        ->postJson('/api/users/likes', [
            'job_posting_id' => $jobPosting->id,
            'like_type' => 'standard',
            'motivation' => '志望動機です。',
        ])
        ->assertCreated();
});

it('reports remaining monthly like counts', function () {
    $user = User::factory()->create();

    Like::factory()->for($user)->count(3)->create();
    Like::factory()->for($user)->super()->create();

    $this->actingAs($user, 'web')
        ->getJson('/api/users/likes/remaining')
        ->assertOk()
        ->assertJson([
            'standard' => ['limit' => 10, 'used' => 3, 'remaining' => 7],
            'super' => ['limit' => 1, 'used' => 1, 'remaining' => 0],
        ]);
});

it('forbids viewing another user\'s like', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $like = Like::factory()->for($owner)->create();

    $this->actingAs($intruder, 'web')
        ->getJson("/api/users/likes/{$like->id}")
        ->assertForbidden();
});

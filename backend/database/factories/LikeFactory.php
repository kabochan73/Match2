<?php

namespace Database\Factories;

use App\Enums\LikeStatus;
use App\Enums\LikeType;
use App\Models\JobPosting;
use App\Models\Like;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Like>
 */
class LikeFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $appliedAt = now();

        return [
            'user_id' => User::factory(),
            'job_posting_id' => JobPosting::factory(),
            'like_type' => LikeType::Standard,
            'motivation' => fake()->text(200),
            'status' => LikeStatus::Applied,
            'applied_at' => $appliedAt,
            'response_deadline' => $appliedAt->copy()->addDays(7),
        ];
    }

    public function super(): static
    {
        return $this->state(['like_type' => LikeType::Super]);
    }

    public function matched(): static
    {
        return $this->state([
            'status' => LikeStatus::Matched,
            'company_responded_at' => now(),
        ]);
    }
}

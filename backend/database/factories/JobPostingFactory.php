<?php

namespace Database\Factories;

use App\Enums\EmploymentType;
use App\Enums\JobPostingStatus;
use App\Models\Company;
use App\Models\JobPosting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JobPosting>
 */
class JobPostingFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'title' => fake()->jobTitle(),
            'description' => fake()->text(200),
            'desired_candidate' => fake()->text(200),
            'employment_type' => fake()->randomElement(EmploymentType::cases()),
            'prefecture' => '東京都',
            'salary_min' => 300000,
            'salary_max' => 500000,
            'status' => JobPostingStatus::Draft,
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => JobPostingStatus::Published,
            'published_at' => now(),
        ]);
    }
}

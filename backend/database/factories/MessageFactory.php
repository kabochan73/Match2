<?php

namespace Database\Factories;

use App\Models\Like;
use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Message>
 */
class MessageFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'like_id' => Like::factory(),
            'sender_type' => (new User)->getMorphClass(),
            'sender_id' => User::factory(),
            'body' => fake()->text(200),
            'created_at' => now(),
        ];
    }
}

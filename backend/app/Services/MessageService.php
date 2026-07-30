<?php

namespace App\Services;

use App\Enums\ApplicationStatus;
use App\Models\Application;
use App\Models\Company;
use App\Models\Message;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class MessageService
{
    public function send(Application $application, User|Company $sender, string $body): Message
    {
        if ($application->status !== ApplicationStatus::Matched) {
            throw ValidationException::withMessages([
                'application_id' => 'マッチが成立していない応募にはメッセージを送信できません。',
            ]);
        }

        return $application->messages()->create([
            'sender_type' => $sender->getMorphClass(),
            'sender_id' => $sender->id,
            'body' => $body,
        ]);
    }

    public function markAsRead(Application $application, User|Company $reader): void
    {
        $otherPartyType = $reader instanceof User ? Company::class : User::class;

        $application->messages()
            ->where('sender_type', (new $otherPartyType)->getMorphClass())
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }
}

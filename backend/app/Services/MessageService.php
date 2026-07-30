<?php

namespace App\Services;

use App\Enums\LikeStatus;
use App\Models\Company;
use App\Models\Like;
use App\Models\Message;
use App\Models\User;
use App\Notifications\NewMessageReceived;
use Illuminate\Validation\ValidationException;

class MessageService
{
    public function send(Like $like, User|Company $sender, string $body): Message
    {
        if ($like->status !== LikeStatus::Matched) {
            throw ValidationException::withMessages([
                'like_id' => 'マッチが成立していない応募にはメッセージを送信できません。',
            ]);
        }

        $message = $like->messages()->create([
            'sender_type' => $sender->getMorphClass(),
            'sender_id' => $sender->id,
            'body' => $body,
        ]);

        $recipient = $sender instanceof User ? $like->jobPosting->company : $like->user;
        $recipient->notify(new NewMessageReceived($message));

        return $message;
    }

    public function markAsRead(Like $like, User|Company $reader): void
    {
        $otherPartyType = $reader instanceof User ? Company::class : User::class;

        $like->messages()
            ->where('sender_type', (new $otherPartyType)->getMorphClass())
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }
}

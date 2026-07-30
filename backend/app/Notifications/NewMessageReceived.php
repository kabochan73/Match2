<?php

namespace App\Notifications;

use App\Models\Message;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class NewMessageReceived extends Notification
{
    public function __construct(private readonly Message $message) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'like_id' => $this->message->like_id,
            'message_id' => $this->message->id,
            'body_excerpt' => Str::limit($this->message->body, 50),
            'message' => '新しいメッセージが届きました。',
        ];
    }
}

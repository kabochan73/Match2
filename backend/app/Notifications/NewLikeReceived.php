<?php

namespace App\Notifications;

use App\Models\Like;
use Illuminate\Notifications\Notification;

class NewLikeReceived extends Notification
{
    public function __construct(private readonly Like $like) {}

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
            'like_id' => $this->like->id,
            'job_posting_id' => $this->like->job_posting_id,
            'job_posting_title' => $this->like->jobPosting->title,
            'user_name' => $this->like->user->name,
            'like_type' => $this->like->like_type->value,
            'message' => "「{$this->like->jobPosting->title}」に新しい応募がありました。",
        ];
    }
}

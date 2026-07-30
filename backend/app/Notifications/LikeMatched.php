<?php

namespace App\Notifications;

use App\Models\Like;
use Illuminate\Notifications\Notification;

class LikeMatched extends Notification
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
            'message' => "「{$this->like->jobPosting->title}」の応募がマッチしました。",
        ];
    }
}

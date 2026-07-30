<?php

namespace App\Models;

use App\Enums\LikeStatus;
use App\Enums\LikeType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['job_posting_id', 'like_type', 'motivation', 'status', 'applied_at', 'response_deadline', 'company_responded_at'])]
class Like extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'like_type' => LikeType::class,
            'status' => LikeStatus::class,
            'applied_at' => 'datetime',
            'response_deadline' => 'datetime',
            'company_responded_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<JobPosting, $this>
     */
    public function jobPosting(): BelongsTo
    {
        return $this->belongsTo(JobPosting::class);
    }

    /**
     * @return HasMany<Message, $this>
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }
}

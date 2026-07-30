<?php

namespace App\Http\Resources;

use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read Like $resource
 */
class CandidateProfileResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'like_type' => $this->like_type,
            'motivation' => $this->motivation,
            'status' => $this->status,
            'applied_at' => $this->applied_at,
            'response_deadline' => $this->response_deadline,
            'company_responded_at' => $this->company_responded_at,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'comment' => $this->user->comment,
                'portfolio_url' => $this->user->portfolio_url,
                'work_experiences' => $this->user->workExperiences,
                'educations' => $this->user->educations,
                'certifications' => $this->user->certifications,
            ],
        ];
    }
}

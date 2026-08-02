<?php

namespace App\Http\Resources;

use App\Models\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read JobPosting $resource
 */
class JobPostingResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'desired_candidate' => $this->desired_candidate,
            'employment_type' => $this->employment_type,
            'prefecture' => $this->prefecture,
            'salary_min' => $this->salary_min,
            'salary_max' => $this->salary_max,
            'published_at' => $this->published_at,
            'company' => [
                'id' => $this->company->id,
                'name' => $this->company->name,
            ],
        ];
    }
}

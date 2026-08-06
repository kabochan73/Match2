<?php

namespace App\Http\Controllers;

use App\Enums\EmploymentType;
use App\Enums\JobPostingStatus;
use App\Enums\Prefecture;
use App\Http\Resources\JobPostingResource;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class JobPostingController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->validate([
            'keyword' => ['nullable', 'string', 'max:255'],
            'prefecture' => ['nullable', Rule::enum(Prefecture::class)],
            'employment_type' => ['nullable', Rule::enum(EmploymentType::class)],
        ]);

        $jobPostings = JobPosting::query()
            ->with('company:id,name')
            ->where('status', JobPostingStatus::Published)
            ->when($filters['keyword'] ?? null, fn ($query, $keyword) => $query->where(
                fn ($query) => $query->where('title', 'like', "%{$keyword}%")
                    ->orWhere('description', 'like', "%{$keyword}%")
            ))
            ->when($filters['prefecture'] ?? null, fn ($query, $prefecture) => $query->where('prefecture', $prefecture))
            ->when($filters['employment_type'] ?? null, fn ($query, $employmentType) => $query->where('employment_type', $employmentType))
            ->latest('published_at')
            ->paginate(30)
            ->withQueryString();

        return JobPostingResource::collection($jobPostings);
    }

    public function show(int $jobPosting): JobPostingResource
    {
        return new JobPostingResource(
            JobPosting::query()
                ->with('company:id,name,email,prefecture,address_line,founded_year,member_count_range')
                ->where('status', JobPostingStatus::Published)
                ->findOrFail($jobPosting)
        );
    }
}

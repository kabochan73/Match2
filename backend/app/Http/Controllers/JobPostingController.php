<?php

namespace App\Http\Controllers;

use App\Enums\EmploymentType;
use App\Enums\JobPostingStatus;
use App\Models\JobPosting;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class JobPostingController extends Controller
{
    /**
     * @return Collection<int, JobPosting>
     */
    public function index(Request $request): Collection
    {
        $filters = $request->validate([
            'keyword' => ['nullable', 'string', 'max:255'],
            'prefecture' => ['nullable', 'string', 'max:20'],
            'employment_type' => ['nullable', Rule::enum(EmploymentType::class)],
        ]);

        return JobPosting::query()
            ->where('status', JobPostingStatus::Published)
            ->when($filters['keyword'] ?? null, fn ($query, $keyword) => $query->where(
                fn ($query) => $query->where('title', 'like', "%{$keyword}%")
                    ->orWhere('description', 'like', "%{$keyword}%")
            ))
            ->when($filters['prefecture'] ?? null, fn ($query, $prefecture) => $query->where('prefecture', $prefecture))
            ->when($filters['employment_type'] ?? null, fn ($query, $employmentType) => $query->where('employment_type', $employmentType))
            ->latest('published_at')
            ->get();
    }

    public function show(int $jobPosting): JobPosting
    {
        return JobPosting::query()
            ->where('status', JobPostingStatus::Published)
            ->findOrFail($jobPosting);
    }
}

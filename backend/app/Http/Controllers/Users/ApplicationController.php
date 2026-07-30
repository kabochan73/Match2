<?php

namespace App\Http\Controllers\Users;

use App\Enums\LikeType;
use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\JobPosting;
use App\Services\ApplicationService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ApplicationController extends Controller
{
    use AuthorizesRequests;

    /**
     * @return Collection<int, Application>
     */
    public function index(Request $request): Collection
    {
        return $request->user()->applications;
    }

    public function show(Application $application): Application
    {
        $this->authorize('view', $application);

        return $application;
    }

    public function store(Request $request, ApplicationService $service): Application
    {
        $validated = $request->validate([
            'job_posting_id' => ['required', 'integer', 'exists:job_postings,id'],
            'like_type' => ['required', Rule::enum(LikeType::class)],
        ]);

        $jobPosting = JobPosting::findOrFail($validated['job_posting_id']);

        return $service->apply($request->user(), $jobPosting, LikeType::from($validated['like_type']));
    }
}

<?php

namespace App\Http\Controllers\Companies;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Services\ApplicationService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    use AuthorizesRequests;

    /**
     * @return Collection<int, Application>
     */
    public function index(Request $request): Collection
    {
        $validated = $request->validate([
            'job_posting_id' => ['nullable', 'integer'],
        ]);

        return Application::query()
            ->whereHas('jobPosting', fn ($query) => $query->where('company_id', $request->user()->id))
            ->when($validated['job_posting_id'] ?? null, fn ($query, $jobPostingId) => $query->where('job_posting_id', $jobPostingId))
            ->with('user')
            ->get();
    }

    public function show(Application $application): Application
    {
        $this->authorize('viewAsCompany', $application);

        return $application->load(['user.workExperiences', 'user.educations', 'user.certifications']);
    }

    public function match(Application $application, ApplicationService $service): Application
    {
        $this->authorize('match', $application);

        return $service->match($application);
    }
}

<?php

namespace App\Http\Controllers\Companies;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobPostings\JobPostingRequest;
use App\Models\JobPosting;
use App\Services\JobPostingService;
use App\Services\RevalidationService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class JobPostingController extends Controller
{
    use AuthorizesRequests;

    public function __construct(private RevalidationService $revalidationService) {}

    /**
     * @return Collection<int, JobPosting>
     */
    public function index(Request $request): Collection
    {
        return $request->user()->jobPostings;
    }

    public function show(JobPosting $jobPosting): JobPosting
    {
        $this->authorize('view', $jobPosting);

        return $jobPosting;
    }

    public function store(JobPostingRequest $request): JobPosting
    {
        return $request->user()->jobPostings()->create($request->validated());
    }

    public function update(JobPostingRequest $request, JobPosting $jobPosting): JobPosting
    {
        $this->authorize('update', $jobPosting);

        $jobPosting->update($request->validated());

        $this->revalidationService->jobPosting($jobPosting);

        return $jobPosting;
    }

    public function destroy(JobPosting $jobPosting): Response
    {
        $this->authorize('delete', $jobPosting);

        $jobPosting->delete();

        $this->revalidationService->jobPosting($jobPosting);

        return response()->noContent();
    }

    public function publish(JobPosting $jobPosting, JobPostingService $service): JobPosting
    {
        $this->authorize('update', $jobPosting);

        return $service->publish($jobPosting);
    }

    public function close(JobPosting $jobPosting, JobPostingService $service): JobPosting
    {
        $this->authorize('update', $jobPosting);

        return $service->close($jobPosting);
    }
}

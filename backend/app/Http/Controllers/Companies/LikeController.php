<?php

namespace App\Http\Controllers\Companies;

use App\Http\Controllers\Controller;
use App\Http\Resources\CandidateProfileResource;
use App\Models\Like;
use App\Services\LikeService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    use AuthorizesRequests;

    /**
     * @return Collection<int, Like>
     */
    public function index(Request $request): Collection
    {
        $validated = $request->validate([
            'job_posting_id' => ['nullable', 'integer'],
        ]);

        return Like::query()
            ->whereHas('jobPosting', fn ($query) => $query->where('company_id', $request->user()->id))
            ->when($validated['job_posting_id'] ?? null, fn ($query, $jobPostingId) => $query->where('job_posting_id', $jobPostingId))
            ->with(['user', 'jobPosting'])
            ->get();
    }

    public function show(Like $like): CandidateProfileResource
    {
        $this->authorize('viewAsCompany', $like);

        $like->load(['user.workExperiences', 'user.educations', 'user.certifications']);

        return new CandidateProfileResource($like);
    }

    public function match(Like $like, LikeService $service): Like
    {
        $this->authorize('match', $like);

        return $service->match($like);
    }
}

<?php

namespace App\Http\Controllers\Users;

use App\Enums\LikeType;
use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use App\Models\Like;
use App\Services\LikeService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LikeController extends Controller
{
    use AuthorizesRequests;

    /**
     * @return Collection<int, Like>
     */
    public function index(Request $request): Collection
    {
        return $request->user()->likes;
    }

    public function show(Like $like): Like
    {
        $this->authorize('view', $like);

        return $like;
    }

    public function store(Request $request, LikeService $service): Like
    {
        $validated = $request->validate([
            'job_posting_id' => ['required', 'integer', 'exists:job_postings,id'],
            'like_type' => ['required', Rule::enum(LikeType::class)],
            'motivation' => ['required', 'string'],
        ]);

        $jobPosting = JobPosting::findOrFail($validated['job_posting_id']);

        return $service->apply(
            $request->user(),
            $jobPosting,
            LikeType::from($validated['like_type']),
            $validated['motivation'],
        );
    }
}

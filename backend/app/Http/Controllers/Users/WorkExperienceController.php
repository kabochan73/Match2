<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\WorkExperiences\WorkExperienceRequest;
use App\Models\WorkExperience;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WorkExperienceController extends Controller
{
    use AuthorizesRequests;

    /**
     * @return Collection<int, WorkExperience>
     */
    public function index(Request $request): Collection
    {
        return $request->user()->workExperiences;
    }

    public function store(WorkExperienceRequest $request): WorkExperience
    {
        return $request->user()->workExperiences()->create($request->validated());
    }

    public function update(WorkExperienceRequest $request, WorkExperience $workExperience): WorkExperience
    {
        $this->authorize('update', $workExperience);

        $workExperience->update($request->validated());

        return $workExperience;
    }

    public function destroy(WorkExperience $workExperience): Response
    {
        $this->authorize('delete', $workExperience);

        $workExperience->delete();

        return response()->noContent();
    }
}

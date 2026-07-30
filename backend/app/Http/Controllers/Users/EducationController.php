<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\Education;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EducationController extends Controller
{
    use AuthorizesRequests;

    /**
     * @return Collection<int, Education>
     */
    public function index(Request $request): Collection
    {
        return $request->user()->educations;
    }

    public function store(Request $request): Education
    {
        return $request->user()->educations()->create($request->validate([
            'school_name' => ['required', 'string', 'max:255'],
        ]));
    }

    public function update(Request $request, Education $education): Education
    {
        $this->authorize('update', $education);

        $education->update($request->validate([
            'school_name' => ['required', 'string', 'max:255'],
        ]));

        return $education;
    }

    public function destroy(Education $education): Response
    {
        $this->authorize('delete', $education);

        $education->delete();

        return response()->noContent();
    }
}

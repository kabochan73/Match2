<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Http\Requests\Certifications\CertificationRequest;
use App\Models\Certification;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CertificationController extends Controller
{
    use AuthorizesRequests;

    /**
     * @return Collection<int, Certification>
     */
    public function index(Request $request): Collection
    {
        return $request->user()->certifications;
    }

    public function store(CertificationRequest $request): Certification
    {
        return $request->user()->certifications()->create($request->validated());
    }

    public function update(CertificationRequest $request, Certification $certification): Certification
    {
        $this->authorize('update', $certification);

        $certification->update($request->validated());

        return $certification;
    }

    public function destroy(Certification $certification): Response
    {
        $this->authorize('delete', $certification);

        $certification->delete();

        return response()->noContent();
    }
}

<?php

namespace App\Http\Controllers\Users;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Message;
use App\Services\MessageService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    use AuthorizesRequests;

    /**
     * @return Collection<int, Message>
     */
    public function index(Request $request, Application $application, MessageService $service): Collection
    {
        $this->authorize('view', $application);

        $service->markAsRead($application, $request->user());

        return $application->messages()->orderBy('created_at')->get();
    }

    public function store(Request $request, Application $application, MessageService $service): Message
    {
        $this->authorize('view', $application);

        $validated = $request->validate([
            'body' => ['required', 'string'],
        ]);

        return $service->send($application, $request->user(), $validated['body']);
    }
}

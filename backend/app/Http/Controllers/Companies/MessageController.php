<?php

namespace App\Http\Controllers\Companies;

use App\Http\Controllers\Controller;
use App\Models\Like;
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
    public function index(Request $request, Like $like, MessageService $service): Collection
    {
        $this->authorize('viewAsCompany', $like);

        $service->markAsRead($like, $request->user());

        return $like->messages()->orderBy('created_at')->get();
    }

    public function store(Request $request, Like $like, MessageService $service): Message
    {
        $this->authorize('viewAsCompany', $like);

        $validated = $request->validate([
            'body' => ['required', 'string'],
        ]);

        return $service->send($like, $request->user(), $validated['body']);
    }
}

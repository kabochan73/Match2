<?php

namespace App\Http\Controllers\Companies;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    /**
     * @return Collection<int, DatabaseNotification>
     */
    public function index(Request $request): Collection
    {
        return $request->user()->notifications;
    }

    public function markAsRead(Request $request, string $notification): DatabaseNotification
    {
        $notification = $request->user()->notifications()->findOrFail($notification);

        $notification->markAsRead();

        return $notification;
    }
}

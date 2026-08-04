"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  markSeekerNotificationAsRead,
  seekerNotificationsQueryOptions,
} from "@/lib/seeker/notifications/api";
import { isMessageNotification } from "@/lib/notifications";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ja-JP");
}

export default function SeekerNotificationsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery(seekerNotificationsQueryOptions);

  const markAsReadMutation = useMutation({
    mutationFn: markSeekerNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: seekerNotificationsQueryOptions.queryKey });
    },
  });

  return (
    <main className="flex w-full flex-1 flex-col items-center gap-6 py-8">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <h1 className="text-2xl font-semibold">通知</h1>
      </div>

      <div className="flex w-full max-w-2xl flex-col gap-3">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => {
                if (notification.read_at === null) {
                  markAsReadMutation.mutate(notification.id);
                }
                const path = isMessageNotification(notification) ? "messages" : "likes";
                router.push(`/${path}/${notification.data.like_id}`);
              }}
              className={`flex flex-col gap-1 rounded border p-4 text-left ${
                notification.read_at === null ? "bg-blue-50" : ""
              }`}
            >
              <span className="text-sm text-gray-800">{notification.data.message}</span>
              <span className="text-xs text-gray-400">
                {formatDateTime(notification.created_at)}
              </span>
            </button>
          ))
        ) : (
          <p className="text-sm text-gray-500">通知はありません</p>
        )}
      </div>
    </main>
  );
}

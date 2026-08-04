import { apiClientFetch } from "@/lib/api/client";
import type { AppNotification } from "@/lib/api/types";

export const seekerNotificationsQueryKey = ["notifications"] as const;

export function fetchSeekerNotifications(): Promise<AppNotification[]> {
  return apiClientFetch<AppNotification[]>("/api/users/notifications");
}

export const seekerNotificationsQueryOptions = {
  queryKey: seekerNotificationsQueryKey,
  queryFn: fetchSeekerNotifications,
};

export function markSeekerNotificationAsRead(id: string): Promise<AppNotification> {
  return apiClientFetch<AppNotification>(`/api/users/notifications/${id}/read`, {
    method: "PATCH",
  });
}

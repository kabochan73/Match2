import { apiClientFetch } from "@/lib/api/client";
import type { AppNotification } from "@/lib/api/types";

export const companyNotificationsQueryKey = ["companies", "notifications"] as const;

export function fetchCompanyNotifications(): Promise<AppNotification[]> {
  return apiClientFetch<AppNotification[]>("/api/companies/notifications");
}

export const companyNotificationsQueryOptions = {
  queryKey: companyNotificationsQueryKey,
  queryFn: fetchCompanyNotifications,
};

export function markCompanyNotificationAsRead(id: string): Promise<AppNotification> {
  return apiClientFetch<AppNotification>(`/api/companies/notifications/${id}/read`, {
    method: "PATCH",
  });
}

import type { AppNotification } from "./api/types";

export function isMessageNotification(notification: AppNotification): boolean {
  return notification.type.endsWith("NewMessageReceived");
}

export function countUnread(notifications: AppNotification[] | undefined): number {
  return notifications?.filter((notification) => notification.read_at === null).length ?? 0;
}

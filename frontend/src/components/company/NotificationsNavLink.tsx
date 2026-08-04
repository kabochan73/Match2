"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { companyNotificationsQueryOptions } from "@/lib/company/notifications/api";
import { countUnread } from "@/lib/notifications";

export function NotificationsNavLink() {
  const { data: notifications } = useQuery(companyNotificationsQueryOptions);
  const unreadCount = countUnread(notifications);

  return (
    <Link href="/companies/notifications" className="relative text-gray-600">
      通知
      {unreadCount > 0 && (
        <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-medium text-white">
          {unreadCount}
        </span>
      )}
    </Link>
  );
}

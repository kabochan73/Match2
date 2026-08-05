import { HydrationBoundary } from "@tanstack/react-query";
import { requireCompanySession } from "@/lib/auth/company-session";
import { NotificationsView } from "@/components/company/notifications/NotificationsView";

export default async function CompanyNotificationsPage() {
  const dehydratedState = await requireCompanySession();

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotificationsView />
    </HydrationBoundary>
  );
}

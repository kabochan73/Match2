import { HydrationBoundary } from "@tanstack/react-query";
import { requireSeekerSession } from "@/lib/seeker/session";
import { NotificationsView } from "@/components/seeker/notifications/NotificationsView";

export default async function SeekerNotificationsPage() {
  const dehydratedState = await requireSeekerSession();

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotificationsView />
    </HydrationBoundary>
  );
}

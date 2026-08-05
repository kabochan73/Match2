import { HydrationBoundary } from "@tanstack/react-query";
import { requireSeekerSession } from "@/lib/seeker/session";
import { MessagesView } from "@/components/seeker/messages/MessagesView";

export default async function SeekerMessagesPage() {
  const dehydratedState = await requireSeekerSession();

  return (
    <HydrationBoundary state={dehydratedState}>
      <MessagesView />
    </HydrationBoundary>
  );
}

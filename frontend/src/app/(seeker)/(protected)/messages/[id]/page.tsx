import { HydrationBoundary } from "@tanstack/react-query";
import { requireSeekerSession } from "@/lib/seeker/session";
import { MessageThreadView } from "@/components/seeker/messages/MessageThreadView";

export default async function SeekerMessageThreadPage() {
  const dehydratedState = await requireSeekerSession();

  return (
    <HydrationBoundary state={dehydratedState}>
      <MessageThreadView />
    </HydrationBoundary>
  );
}

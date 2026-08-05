import { HydrationBoundary } from "@tanstack/react-query";
import { requireSeekerSession } from "@/lib/seeker/session";
import { LikesView } from "@/components/seeker/likes/LikesView";

export default async function SeekerLikesPage() {
  const dehydratedState = await requireSeekerSession();

  return (
    <HydrationBoundary state={dehydratedState}>
      <LikesView />
    </HydrationBoundary>
  );
}

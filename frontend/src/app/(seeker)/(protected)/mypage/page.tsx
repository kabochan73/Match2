import { HydrationBoundary } from "@tanstack/react-query";
import { requireSeekerSession } from "@/lib/seeker/session";
import { MyPageView } from "@/components/seeker/mypage/MyPageView";

export default async function MyPagePage() {
  const dehydratedState = await requireSeekerSession();

  return (
    <HydrationBoundary state={dehydratedState}>
      <MyPageView />
    </HydrationBoundary>
  );
}

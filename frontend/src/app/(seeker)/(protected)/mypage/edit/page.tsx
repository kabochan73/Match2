import { HydrationBoundary } from "@tanstack/react-query";
import { requireSeekerSession } from "@/lib/seeker/session";
import { MyPageEditView } from "@/components/seeker/mypage/MyPageEditView";

export default async function MyPageEditPage() {
  const dehydratedState = await requireSeekerSession();

  return (
    <HydrationBoundary state={dehydratedState}>
      <MyPageEditView />
    </HydrationBoundary>
  );
}

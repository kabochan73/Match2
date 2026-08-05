import { HydrationBoundary } from "@tanstack/react-query";
import { requireCompanySession } from "@/lib/auth/company-session";
import { LikeDetailView } from "@/components/company/likes/LikeDetailView";

export default async function CompanyLikePage() {
  const dehydratedState = await requireCompanySession();

  return (
    <HydrationBoundary state={dehydratedState}>
      <LikeDetailView />
    </HydrationBoundary>
  );
}

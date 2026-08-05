import { HydrationBoundary } from "@tanstack/react-query";
import { requireCompanySession } from "@/lib/auth/company-session";
import { LikesView } from "@/components/company/likes/LikesView";

export default async function CompanyLikesPage() {
  const dehydratedState = await requireCompanySession();

  return (
    <HydrationBoundary state={dehydratedState}>
      <LikesView />
    </HydrationBoundary>
  );
}

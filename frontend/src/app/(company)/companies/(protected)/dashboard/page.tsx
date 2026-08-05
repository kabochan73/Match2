import { HydrationBoundary } from "@tanstack/react-query";
import { requireCompanySession } from "@/lib/auth/company-session";
import { DashboardView } from "@/components/company/dashboard/DashboardView";

export default async function CompanyDashboardPage() {
  const dehydratedState = await requireCompanySession();

  return (
    <HydrationBoundary state={dehydratedState}>
      <DashboardView />
    </HydrationBoundary>
  );
}

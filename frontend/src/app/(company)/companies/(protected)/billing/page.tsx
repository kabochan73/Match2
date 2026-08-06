import { HydrationBoundary } from "@tanstack/react-query";
import { requireCompanySession } from "@/lib/auth/company-session";
import { BillingView } from "@/components/company/billing/BillingView";

export default async function CompanyBillingPage() {
  const dehydratedState = await requireCompanySession();

  return (
    <HydrationBoundary state={dehydratedState}>
      <BillingView />
    </HydrationBoundary>
  );
}

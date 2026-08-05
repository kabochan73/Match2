import { HydrationBoundary } from "@tanstack/react-query";
import { requireCompanySession } from "@/lib/auth/company-session";
import { MessageThreadView } from "@/components/company/messages/MessageThreadView";

export default async function CompanyMessageThreadPage() {
  const dehydratedState = await requireCompanySession();

  return (
    <HydrationBoundary state={dehydratedState}>
      <MessageThreadView />
    </HydrationBoundary>
  );
}

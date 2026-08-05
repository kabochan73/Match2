import { HydrationBoundary } from "@tanstack/react-query";
import { requireCompanySession } from "@/lib/auth/company-session";
import { MessagesView } from "@/components/company/messages/MessagesView";

export default async function CompanyMessagesPage() {
  const dehydratedState = await requireCompanySession();

  return (
    <HydrationBoundary state={dehydratedState}>
      <MessagesView />
    </HydrationBoundary>
  );
}

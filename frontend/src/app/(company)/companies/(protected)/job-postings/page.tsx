import { HydrationBoundary } from "@tanstack/react-query";
import { requireCompanySession } from "@/lib/auth/company-session";
import { JobPostingsListView } from "@/components/company/job-postings/JobPostingsListView";

export default async function CompanyJobPostingsPage() {
  const dehydratedState = await requireCompanySession();

  return (
    <HydrationBoundary state={dehydratedState}>
      <JobPostingsListView />
    </HydrationBoundary>
  );
}

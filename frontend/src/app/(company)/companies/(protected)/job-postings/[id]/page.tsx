import { HydrationBoundary } from "@tanstack/react-query";
import { requireCompanySession } from "@/lib/auth/company-session";
import { JobPostingDetailView } from "@/components/company/job-postings/JobPostingDetailView";

export default async function CompanyJobPostingPage() {
  const dehydratedState = await requireCompanySession();

  return (
    <HydrationBoundary state={dehydratedState}>
      <JobPostingDetailView />
    </HydrationBoundary>
  );
}

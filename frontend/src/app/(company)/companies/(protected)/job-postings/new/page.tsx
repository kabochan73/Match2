import { HydrationBoundary } from "@tanstack/react-query";
import { requireCompanySession } from "@/lib/auth/company-session";
import { JobPostingNewView } from "@/components/company/job-postings/JobPostingNewView";

export default async function NewCompanyJobPostingPage() {
  const dehydratedState = await requireCompanySession();

  return (
    <HydrationBoundary state={dehydratedState}>
      <JobPostingNewView />
    </HydrationBoundary>
  );
}

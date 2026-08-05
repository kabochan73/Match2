import { HydrationBoundary } from "@tanstack/react-query";
import { requireCompanySession } from "@/lib/auth/company-session";
import { JobPostingEditView } from "@/components/company/job-postings/JobPostingEditView";

export default async function EditCompanyJobPostingPage() {
  const dehydratedState = await requireCompanySession();

  return (
    <HydrationBoundary state={dehydratedState}>
      <JobPostingEditView />
    </HydrationBoundary>
  );
}

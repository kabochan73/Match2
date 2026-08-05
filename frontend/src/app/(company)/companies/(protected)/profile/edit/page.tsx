import { HydrationBoundary } from "@tanstack/react-query";
import { requireCompanySession } from "@/lib/auth/company-session";
import { ProfileEditView } from "@/components/company/profile/ProfileEditView";

export default async function CompanyProfileEditPage() {
  const dehydratedState = await requireCompanySession();

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProfileEditView />
    </HydrationBoundary>
  );
}

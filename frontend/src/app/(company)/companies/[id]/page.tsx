import { notFound } from "next/navigation";
import { JobsHeader } from "@/components/jobs/JobsHeader";
import { CompanyProfileDetails } from "@/components/company/profile/CompanyProfileDetails";
import { fetchCompanyProfile } from "@/lib/companies/api";
import { ApiError } from "@/lib/api/errors";
import type { CompanyProfile } from "@/lib/api/types";

async function getCompanyProfile(id: string): Promise<CompanyProfile> {
  try {
    return await fetchCompanyProfile(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = await getCompanyProfile(id);

  return (
    <>
      <JobsHeader />

      <main className="flex w-full flex-1 flex-col items-center gap-10 py-8">
        <div className="flex w-full max-w-2xl items-center justify-between">
          <h1 className="text-2xl font-semibold">企業プロフィール</h1>
        </div>

        <CompanyProfileDetails company={company} />
      </main>
    </>
  );
}

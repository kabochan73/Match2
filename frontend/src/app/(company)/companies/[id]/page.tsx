import { notFound } from "next/navigation";
import { JobsHeader } from "@/components/jobs/JobsHeader";
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

      <main className="flex w-full flex-1 flex-col items-center px-6 py-10">
        <article className="flex w-full max-w-2xl flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">{company.name}</h1>
            {(company.prefecture || company.address_line) && (
              <p className="text-sm text-gray-600">
                {company.prefecture}
                {company.address_line}
              </p>
            )}
          </div>

          {company.description && (
            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-medium">会社紹介</h2>
              <p className="whitespace-pre-wrap text-sm text-gray-700">{company.description}</p>
            </section>
          )}
        </article>
      </main>
    </>
  );
}

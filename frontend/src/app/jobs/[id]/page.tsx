import Link from "next/link";
import { notFound } from "next/navigation";
import { JobsHeader } from "@/components/jobs/JobsHeader";
import { ApplySection } from "@/components/jobs/ApplySection";
import { fetchJobPosting } from "@/lib/jobs/api";
import { ApiError } from "@/lib/api/errors";
import { EMPLOYMENT_TYPE_OPTIONS } from "@/lib/seeker/work-experiences/schemas";
import { formatSalaryRange } from "@/lib/jobs/format";
import type { JobPosting } from "@/lib/api/types";

const EMPLOYMENT_TYPE_LABELS = Object.fromEntries(
  EMPLOYMENT_TYPE_OPTIONS.map((option) => [option.value, option.label]),
);

async function getJobPosting(id: string): Promise<JobPosting> {
  try {
    return await fetchJobPosting(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export default async function JobPostingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const jobPosting = await getJobPosting(id);

  return (
    <>
      <JobsHeader />

      <main className="flex w-full flex-1 flex-col items-center px-6 py-10">
        <article className="flex w-full max-w-2xl flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-semibold">{jobPosting.title}</h1>
            <Link
              href={`/companies/${jobPosting.company.id}`}
              className="text-2xl font-bold text-gray-600 hover:text-brand hover:underline"
            >
              {jobPosting.company.name}
            </Link>
            <div className="flex flex-wrap gap-2 text-sm text-gray-800">
              <span className="bg-sky-200 px-2 py-0.5 font-medium">{jobPosting.prefecture}</span>
              <span className="bg-sky-200 px-2 py-0.5 font-medium">
                {EMPLOYMENT_TYPE_LABELS[jobPosting.employment_type]}
              </span>
              <span className="bg-sky-200 px-2 py-0.5 font-medium">
                {formatSalaryRange(jobPosting.salary_min, jobPosting.salary_max)}
              </span>
            </div>
          </div>

          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">仕事内容</h2>
            <p className="whitespace-pre-wrap text-sm text-gray-700">
              {jobPosting.description}
            </p>
          </section>

          {jobPosting.desired_candidate && (
            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-medium">求める人物像</h2>
              <p className="whitespace-pre-wrap text-sm text-gray-700">
                {jobPosting.desired_candidate}
              </p>
            </section>
          )}

          <ApplySection jobPostingId={jobPosting.id} />
        </article>
      </main>
    </>
  );
}

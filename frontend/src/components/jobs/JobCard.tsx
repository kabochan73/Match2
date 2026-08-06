import Link from "next/link";
import { EMPLOYMENT_TYPE_OPTIONS } from "@/lib/seeker/work-experiences/schemas";
import { formatSalaryRange } from "@/lib/jobs/format";
import type { JobPosting } from "@/lib/api/types";

const EMPLOYMENT_TYPE_LABELS = Object.fromEntries(
  EMPLOYMENT_TYPE_OPTIONS.map((option) => [option.value, option.label]),
);

export function JobCard({ jobPosting }: { jobPosting: JobPosting }) {
  return (
    <Link
      href={`/jobs/${jobPosting.id}`}
      className="flex w-full flex-col gap-2 rounded border p-4 transition-transform hover:-translate-y-1 hover:border-brand hover:shadow-md"
    >
      <h3 className="font-bold text-2xl">{jobPosting.title}</h3>
      <p className="text-xl text-gray-600 font-bold">{jobPosting.company.name}</p>
      <div className="flex flex-wrap gap-2 text-sm text-gray-800">
        <span className="bg-sky-200 px-2 py-0.5 font-medium">
          {jobPosting.prefecture}
          </span>
        <span className="bg-sky-200 px-2 py-0.5 font-medium">
          {EMPLOYMENT_TYPE_LABELS[jobPosting.employment_type]}
        </span>
        <span className="bg-sky-200 px-2 py-0.5 font-medium">
          {formatSalaryRange(jobPosting.salary_min, jobPosting.salary_max)}
        </span>
      </div>
    </Link>
  );
}

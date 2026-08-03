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
      className="flex w-full flex-col gap-2 rounded border p-4 hover:bg-gray-50"
    >
      <p className="text-sm text-gray-500">{jobPosting.company.name}</p>
      <h3 className="font-medium">{jobPosting.title}</h3>
      <div className="flex gap-3 text-sm text-gray-600">
        <span>{jobPosting.prefecture}</span>
        <span>{EMPLOYMENT_TYPE_LABELS[jobPosting.employment_type]}</span>
        <span>{formatSalaryRange(jobPosting.salary_min, jobPosting.salary_max)}</span>
      </div>
    </Link>
  );
}

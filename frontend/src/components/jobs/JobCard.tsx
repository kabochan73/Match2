import Link from "next/link";
import { EMPLOYMENT_TYPE_OPTIONS } from "@/lib/seeker/work-experiences/schemas";
import type { JobPosting } from "@/lib/api/types";

const EMPLOYMENT_TYPE_LABELS = Object.fromEntries(
  EMPLOYMENT_TYPE_OPTIONS.map((option) => [option.value, option.label]),
);

function formatSalary(min: number | null, max: number | null): string {
  if (min === null && max === null) return "給与応相談";
  if (min !== null && max !== null) return `月給 ${min.toLocaleString()}円 〜 ${max.toLocaleString()}円`;
  if (min !== null) return `月給 ${min.toLocaleString()}円 〜`;
  return `〜 月給 ${max!.toLocaleString()}円`;
}

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
        <span>{formatSalary(jobPosting.salary_min, jobPosting.salary_max)}</span>
      </div>
    </Link>
  );
}

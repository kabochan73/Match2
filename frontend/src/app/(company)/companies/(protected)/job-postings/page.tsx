"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { companyJobPostingsQueryOptions } from "@/lib/company/job-postings/api";
import { JOB_POSTING_STATUS_LABELS } from "@/lib/company/job-postings/schemas";
import { formatSalaryRange } from "@/lib/jobs/format";

export default function CompanyJobPostingsPage() {
  const { data: jobPostings } = useQuery(companyJobPostingsQueryOptions);

  return (
    <main className="flex w-full flex-1 flex-col items-center gap-6 py-8">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <h1 className="text-2xl font-semibold">求人管理</h1>
        <Link href="/companies/job-postings/new" className="rounded bg-black px-4 py-2 text-sm text-white">
          新規作成
        </Link>
      </div>

      <div className="flex w-full max-w-2xl flex-col gap-3">
        {jobPostings && jobPostings.length > 0 ? (
          jobPostings.map((jobPosting) => (
            <Link
              key={jobPosting.id}
              href={`/companies/job-postings/${jobPosting.id}`}
              className="flex items-center justify-between rounded border p-4"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">{jobPosting.title}</span>
                <span className="text-sm text-gray-600">
                  {formatSalaryRange(jobPosting.salary_min, jobPosting.salary_max)}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {JOB_POSTING_STATUS_LABELS[jobPosting.status]}
              </span>
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-500">登録された求人はありません</p>
        )}
      </div>
    </main>
  );
}

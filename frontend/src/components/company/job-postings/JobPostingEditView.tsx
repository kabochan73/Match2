"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { JobPostingForm } from "@/components/company/job-postings/JobPostingForm";
import {
  companyJobPostingQueryKey,
  companyJobPostingsQueryKey,
  fetchCompanyJobPosting,
  updateCompanyJobPosting,
} from "@/lib/company/job-postings/api";

export function JobPostingEditView() {
  const { id } = useParams<{ id: string }>();
  const jobPostingId = Number(id);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: jobPosting } = useQuery({
    queryKey: companyJobPostingQueryKey(jobPostingId),
    queryFn: () => fetchCompanyJobPosting(jobPostingId),
  });

  if (!jobPosting) return null;

  return (
    <main className="flex w-full flex-1 flex-col items-center gap-6 py-8">
      <div className="flex w-full max-w-sm items-center justify-between">
        <h1 className="text-2xl font-semibold">求人を編集</h1>
        <Link href={`/companies/job-postings/${jobPostingId}`} className="text-sm text-gray-600">
          詳細に戻る
        </Link>
      </div>

      <JobPostingForm
        submitLabel="更新する"
        defaultValues={{
          title: jobPosting.title,
          description: jobPosting.description,
          desired_candidate: jobPosting.desired_candidate ?? "",
          employment_type: jobPosting.employment_type,
          prefecture: jobPosting.prefecture,
          salary_min:
            jobPosting.salary_min === null ? "" : String(Math.round(jobPosting.salary_min / 10000)),
          salary_max:
            jobPosting.salary_max === null ? "" : String(Math.round(jobPosting.salary_max / 10000)),
        }}
        onSubmit={async (data) => {
          const updated = await updateCompanyJobPosting(jobPostingId, data);
          queryClient.setQueryData(companyJobPostingQueryKey(jobPostingId), updated);
          await queryClient.invalidateQueries({ queryKey: companyJobPostingsQueryKey });
          router.push(`/companies/job-postings/${jobPostingId}`);
        }}
      />
    </main>
  );
}

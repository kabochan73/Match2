"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { JobPostingForm } from "@/components/company/job-postings/JobPostingForm";
import { companyJobPostingsQueryKey, createCompanyJobPosting } from "@/lib/company/job-postings/api";

export default function NewCompanyJobPostingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <main className="flex w-full flex-1 flex-col items-center gap-6 py-8">
      <div className="flex w-full max-w-sm items-center justify-between">
        <h1 className="text-2xl font-semibold">求人を作成</h1>
        <Link href="/companies/job-postings" className="text-sm text-gray-600">
          一覧に戻る
        </Link>
      </div>

      <JobPostingForm
        submitLabel="作成する"
        onSubmit={async (data) => {
          const jobPosting = await createCompanyJobPosting(data);
          await queryClient.invalidateQueries({ queryKey: companyJobPostingsQueryKey });
          router.push(`/companies/job-postings/${jobPosting.id}`);
        }}
      />
    </main>
  );
}

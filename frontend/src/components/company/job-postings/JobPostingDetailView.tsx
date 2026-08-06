"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  closeCompanyJobPosting,
  companyJobPostingQueryKey,
  companyJobPostingsQueryKey,
  deleteCompanyJobPosting,
  fetchCompanyJobPosting,
  publishCompanyJobPosting,
} from "@/lib/company/job-postings/api";
import { JOB_POSTING_STATUS_LABELS } from "@/lib/company/job-postings/schemas";
import { EMPLOYMENT_TYPE_OPTIONS } from "@/lib/seeker/work-experiences/schemas";
import { formatSalaryRange } from "@/lib/jobs/format";

const EMPLOYMENT_TYPE_LABELS = Object.fromEntries(
  EMPLOYMENT_TYPE_OPTIONS.map((option) => [option.value, option.label]),
);

export function JobPostingDetailView() {
  const { id } = useParams<{ id: string }>();
  const jobPostingId = Number(id);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: jobPosting } = useQuery({
    queryKey: companyJobPostingQueryKey(jobPostingId),
    queryFn: () => fetchCompanyJobPosting(jobPostingId),
  });

  const publishMutation = useMutation({
    mutationFn: () => publishCompanyJobPosting(jobPostingId),
    onSuccess: (updated) => {
      queryClient.setQueryData(companyJobPostingQueryKey(jobPostingId), updated);
      queryClient.invalidateQueries({ queryKey: companyJobPostingsQueryKey });
    },
  });

  const closeMutation = useMutation({
    mutationFn: () => closeCompanyJobPosting(jobPostingId),
    onSuccess: (updated) => {
      queryClient.setQueryData(companyJobPostingQueryKey(jobPostingId), updated);
      queryClient.invalidateQueries({ queryKey: companyJobPostingsQueryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCompanyJobPosting(jobPostingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyJobPostingsQueryKey });
      router.push("/companies/job-postings");
    },
  });

  if (!jobPosting) return null;

  return (
    <main className="flex w-full flex-1 flex-col items-center gap-6 py-8">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <Link href="/companies/job-postings" className="text-sm text-gray-600">
          一覧に戻る
        </Link>
        <Link
          href={`/companies/job-postings/${jobPosting.id}/edit`}
          className="rounded border px-4 py-2 text-sm"
        >
          編集する
        </Link>
      </div>

      <article className="flex w-full max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-500">
            {JOB_POSTING_STATUS_LABELS[jobPosting.status]}
          </span>
          <h1 className="text-2xl font-semibold">{jobPosting.title}</h1>
          <div className="flex gap-3 text-sm text-gray-600">
            <span>{jobPosting.prefecture}</span>
            <span>{EMPLOYMENT_TYPE_LABELS[jobPosting.employment_type]}</span>
            <span>{formatSalaryRange(jobPosting.salary_min, jobPosting.salary_max)}</span>
          </div>
        </div>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-medium">仕事内容</h2>
          <p className="whitespace-pre-wrap text-sm text-gray-700">{jobPosting.description}</p>
        </section>

        {jobPosting.desired_candidate && (
          <section className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">求める人物像</h2>
            <p className="whitespace-pre-wrap text-sm text-gray-700">
              {jobPosting.desired_candidate}
            </p>
          </section>
        )}

        {jobPosting.status === "unpublished" && (
          <p className="text-sm text-red-600">
            決済に失敗したため非公開になっています。
            <Link href="/companies/billing" className="underline">
              お支払いページ
            </Link>
            で支払い方法を更新すると、再公開できるようになります。
          </p>
        )}

        <div className="flex gap-2">
          {(jobPosting.status === "draft" || jobPosting.status === "unpublished") && (
            <button
              type="button"
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending}
              className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              公開する
            </button>
          )}
          {jobPosting.status === "published" && (
            <button
              type="button"
              onClick={() => closeMutation.mutate()}
              disabled={closeMutation.isPending}
              className="rounded border px-4 py-2 text-sm disabled:opacity-50"
            >
              募集を終了する
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (confirm("この求人を削除しますか?")) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isPending}
            className="rounded border border-red-600 px-4 py-2 text-sm text-red-600 disabled:opacity-50"
          >
            削除する
          </button>
        </div>
      </article>
    </main>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { companyLikesQueryOptions } from "@/lib/company/likes/api";
import { LIKE_STATUS_LABELS, LIKE_TYPE_LABELS } from "@/lib/company/likes/schemas";
import { companyJobPostingsQueryOptions } from "@/lib/company/job-postings/api";
import { calculateAge } from "@/lib/age";

export function LikesView() {
  const [jobPostingId, setJobPostingId] = useState<number | undefined>(undefined);

  const { data: jobPostings } = useQuery(companyJobPostingsQueryOptions);
  const { data: likes } = useQuery(companyLikesQueryOptions(jobPostingId));
  // マッチ済みはメッセージ画面に移動するので、ここでは表示しない。
  const unmatched = likes?.filter((like) => like.status !== "matched") ?? [];

  return (
    <main className="flex w-full flex-1 flex-col items-center gap-6 py-8">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <h1 className="text-2xl font-semibold">いいね一覧</h1>
        <select
          value={jobPostingId ?? ""}
          onChange={(e) =>
            setJobPostingId(e.target.value === "" ? undefined : Number(e.target.value))
          }
          className="rounded border px-3 py-2 text-sm"
        >
          <option value="">すべての求人</option>
          {jobPostings?.map((jobPosting) => (
            <option key={jobPosting.id} value={jobPosting.id}>
              {jobPosting.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex w-full max-w-2xl flex-col gap-3">
        {unmatched.length > 0 ? (
          unmatched.map((like) => (
            <Link
              key={like.id}
              href={`/companies/likes/${like.id}`}
              className="flex items-center justify-between rounded border p-4"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">
                  {like.user.name}({calculateAge(like.user.birth_date)}歳)
                </span>
                <span className="text-sm text-gray-600">{like.job_posting.title}</span>
                <span className="text-xs text-gray-500">{LIKE_TYPE_LABELS[like.like_type]}</span>
              </div>
              <span className="text-sm text-gray-600">{LIKE_STATUS_LABELS[like.status]}</span>
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-500">まだいいねは届いていません</p>
        )}
      </div>
    </main>
  );
}

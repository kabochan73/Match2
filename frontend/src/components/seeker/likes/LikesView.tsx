"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { seekerLikesQueryOptions } from "@/lib/seeker/likes/api";
import { LIKE_STATUS_LABELS, LIKE_TYPE_LABELS } from "@/lib/seeker/likes/schemas";

function formatRemainingDays(deadline: string): string {
  const diffMs = new Date(deadline).getTime() - Date.now();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return days <= 0 ? "本日まで" : `残り${days}日`;
}

export function LikesView() {
  const { data: likes } = useQuery(seekerLikesQueryOptions);
  // マッチ済みはメッセージ画面に移動するので、ここでは表示しない。
  const unmatched = likes?.filter((like) => like.status !== "matched") ?? [];

  return (
    <main className="flex w-full flex-1 flex-col items-center gap-6 py-8">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <h1 className="text-2xl font-semibold">いいね一覧</h1>
      </div>

      <div className="flex w-full max-w-2xl flex-col gap-3">
        {unmatched.length > 0 ? (
          unmatched.map((like) => (
            <Link
              key={like.id}
              href={`/jobs/${like.job_posting_id}`}
              className="flex items-center justify-between rounded border p-4"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">{like.job_posting.title}</span>
                <span className="text-sm text-gray-600">{like.job_posting.company.name}</span>
                <span className="text-xs text-gray-500">{LIKE_TYPE_LABELS[like.like_type]}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm text-gray-600">{LIKE_STATUS_LABELS[like.status]}</span>
                {like.status === "applied" && (
                  <span className="text-xs text-gray-500">
                    {formatRemainingDays(like.response_deadline)}
                  </span>
                )}
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-500">まだいいねした求人はありません</p>
        )}
      </div>
    </main>
  );
}

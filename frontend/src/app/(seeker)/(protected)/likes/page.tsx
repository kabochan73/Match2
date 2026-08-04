"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { seekerLikesQueryOptions } from "@/lib/seeker/likes/api";
import { LIKE_STATUS_LABELS, LIKE_TYPE_LABELS } from "@/lib/seeker/likes/schemas";

export default function SeekerLikesPage() {
  const { data: likes } = useQuery(seekerLikesQueryOptions);

  return (
    <main className="flex w-full flex-1 flex-col items-center gap-6 py-8">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <h1 className="text-2xl font-semibold">いいね一覧</h1>
      </div>

      <div className="flex w-full max-w-2xl flex-col gap-3">
        {likes && likes.length > 0 ? (
          likes.map((like) => (
            <Link
              key={like.id}
              href={`/likes/${like.id}`}
              className="flex items-center justify-between rounded border p-4"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">{like.job_posting.title}</span>
                <span className="text-sm text-gray-600">{like.job_posting.company.name}</span>
                <span className="text-xs text-gray-500">{LIKE_TYPE_LABELS[like.like_type]}</span>
              </div>
              <span className="text-sm text-gray-600">{LIKE_STATUS_LABELS[like.status]}</span>
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-500">まだいいねした求人はありません</p>
        )}
      </div>
    </main>
  );
}

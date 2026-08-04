"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { seekerLikesQueryOptions } from "@/lib/seeker/likes/api";

export default function SeekerMessagesPage() {
  const { data: likes } = useQuery(seekerLikesQueryOptions);
  const matched = likes?.filter((like) => like.status === "matched") ?? [];

  return (
    <main className="flex w-full flex-1 flex-col items-center gap-6 py-8">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <h1 className="text-2xl font-semibold">メッセージ</h1>
      </div>

      <div className="flex w-full max-w-2xl flex-col gap-3">
        {matched.length > 0 ? (
          matched.map((like) => (
            <Link
              key={like.id}
              href={`/messages/${like.id}`}
              className="flex flex-col gap-1 rounded border p-4"
            >
              <span className="font-medium">{like.job_posting.title}</span>
              <span className="text-sm text-gray-600">{like.job_posting.company.name}</span>
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-500">マッチしたやり取りはまだありません</p>
        )}
      </div>
    </main>
  );
}

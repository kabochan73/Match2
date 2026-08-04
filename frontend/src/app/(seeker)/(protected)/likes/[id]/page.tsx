"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchSeekerLike, seekerLikeQueryKey } from "@/lib/seeker/likes/api";
import { LIKE_STATUS_LABELS, LIKE_TYPE_LABELS } from "@/lib/seeker/likes/schemas";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ja-JP");
}

export default function SeekerLikePage() {
  const { id } = useParams<{ id: string }>();
  const likeId = Number(id);

  const { data: like } = useQuery({
    queryKey: seekerLikeQueryKey(likeId),
    queryFn: () => fetchSeekerLike(likeId),
  });

  if (!like) return null;

  return (
    <main className="flex w-full flex-1 flex-col items-center gap-6 py-8">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <Link href="/likes" className="text-sm text-gray-600">
          一覧に戻る
        </Link>
      </div>

      <article className="flex w-full max-w-2xl flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-500">{LIKE_STATUS_LABELS[like.status]}</span>
          <h1 className="text-2xl font-semibold">{like.job_posting.title}</h1>
          <span className="text-sm text-gray-600">{like.job_posting.company.name}</span>
          <span className="text-xs text-gray-500">{LIKE_TYPE_LABELS[like.like_type]}</span>
        </div>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-medium">志望動機</h2>
          <p className="whitespace-pre-wrap text-sm text-gray-700">{like.motivation}</p>
        </section>

        <div className="flex flex-col gap-1 text-sm text-gray-600">
          <span>応募日時: {formatDateTime(like.applied_at)}</span>
          {like.status === "applied" && (
            <span>企業からの反応期限: {formatDateTime(like.response_deadline)}</span>
          )}
        </div>
      </article>
    </main>
  );
}

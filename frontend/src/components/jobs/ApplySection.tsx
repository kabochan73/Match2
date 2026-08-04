"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userMeQueryOptions } from "@/lib/seeker/users";
import { companyMeQueryOptions } from "@/lib/auth/companies";
import { createSeekerLike, seekerLikesQueryKey, seekerLikesQueryOptions } from "@/lib/seeker/likes/api";
import { LIKE_STATUS_LABELS } from "@/lib/seeker/likes/schemas";
import { ApplyForm } from "@/components/seeker/jobs/ApplyForm";

// Mirrors JobsHeader: /jobs/[id] is public, but whether (and what) to show
// here depends on who's logged in, which only exists client-side.
export function ApplySection({ jobPostingId }: { jobPostingId: number }) {
  const { data: user } = useQuery(userMeQueryOptions);
  const { data: company } = useQuery(companyMeQueryOptions);
  const { data: likes } = useQuery({ ...seekerLikesQueryOptions, enabled: !!user });
  const queryClient = useQueryClient();
  const router = useRouter();

  if (company) return null;

  if (!user) {
    return (
      <div className="rounded border p-4 text-sm">
        <Link href="/login" className="text-blue-600 underline">
          ログインして応募する
        </Link>
      </div>
    );
  }

  const existingLike = likes?.find((like) => like.job_posting_id === jobPostingId);

  if (existingLike) {
    return (
      <div className="flex items-center gap-2 rounded border p-4 text-sm text-gray-600">
        <span>応募済み({LIKE_STATUS_LABELS[existingLike.status]})</span>
        <Link href={`/likes/${existingLike.id}`} className="text-blue-600 underline">
          詳細を見る
        </Link>
      </div>
    );
  }

  return (
    <ApplyForm
      onSubmit={async (data) => {
        const like = await createSeekerLike({ ...data, job_posting_id: jobPostingId });
        await queryClient.invalidateQueries({ queryKey: seekerLikesQueryKey });
        router.push(`/likes/${like.id}`);
      }}
    />
  );
}

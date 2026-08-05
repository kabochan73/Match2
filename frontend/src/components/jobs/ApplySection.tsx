"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userMeQueryOptions } from "@/lib/seeker/users";
import { companyMeQueryOptions } from "@/lib/auth/companies";
import {
  createSeekerLike,
  seekerLikesQueryKey,
  seekerLikesQueryOptions,
  seekerLikesRemainingQueryKey,
  seekerLikesRemainingQueryOptions,
} from "@/lib/seeker/likes/api";
import { LIKE_STATUS_LABELS } from "@/lib/seeker/likes/schemas";
import { ApplyForm } from "@/components/seeker/jobs/ApplyForm";
import { Modal } from "@/components/jobs/Modal";

// Mirrors JobsHeader: /jobs/[id] is public, but whether (and what) to show
// here depends on who's logged in, which only exists client-side.
export function ApplySection({ jobPostingId }: { jobPostingId: number }) {
  const { data: user } = useQuery(userMeQueryOptions);
  const { data: company } = useQuery(companyMeQueryOptions);
  const { data: likes } = useQuery({ ...seekerLikesQueryOptions, enabled: !!user });
  const { data: remaining } = useQuery({ ...seekerLikesRemainingQueryOptions, enabled: !!user });
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <div className="rounded border p-4 text-sm text-gray-600">
        応募済み({LIKE_STATUS_LABELS[existingLike.status]})
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="w-fit rounded bg-black px-4 py-2 text-sm text-white"
      >
        この求人に応募する
      </button>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ApplyForm
          remaining={remaining}
          onSubmit={async (data) => {
            await createSeekerLike({ ...data, job_posting_id: jobPostingId });
            await queryClient.invalidateQueries({ queryKey: seekerLikesQueryKey });
            await queryClient.invalidateQueries({ queryKey: seekerLikesRemainingQueryKey });
            setIsModalOpen(false);
          }}
        />
      </Modal>
    </>
  );
}

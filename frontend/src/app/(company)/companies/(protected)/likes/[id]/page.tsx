"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  companyLikeQueryKey,
  companyLikesBaseKey,
  fetchCompanyLike,
  matchCompanyLike,
} from "@/lib/company/likes/api";
import { LIKE_STATUS_LABELS, LIKE_TYPE_LABELS } from "@/lib/company/likes/schemas";
import { EMPLOYMENT_TYPE_OPTIONS } from "@/lib/seeker/work-experiences/schemas";
import { getErrorMessage } from "@/lib/api/validation";
import { calculateAge } from "@/lib/age";

const EMPLOYMENT_TYPE_LABELS = Object.fromEntries(
  EMPLOYMENT_TYPE_OPTIONS.map((option) => [option.value, option.label]),
);

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("ja-JP");
}

export default function CompanyLikePage() {
  const { id } = useParams<{ id: string }>();
  const likeId = Number(id);
  const queryClient = useQueryClient();
  const [matchError, setMatchError] = useState<string | null>(null);

  const { data: like } = useQuery({
    queryKey: companyLikeQueryKey(likeId),
    queryFn: () => fetchCompanyLike(likeId),
  });

  const canMatch = like?.status === "applied" && new Date(like.response_deadline) > new Date();

  const matchMutation = useMutation({
    mutationFn: () => matchCompanyLike(likeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyLikeQueryKey(likeId) });
      queryClient.invalidateQueries({ queryKey: companyLikesBaseKey });
    },
    onError: (error) => {
      setMatchError(getErrorMessage(error));
    },
  });

  if (!like) return null;

  return (
    <main className="flex w-full flex-1 flex-col items-center gap-6 py-8">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <Link href="/companies/likes" className="text-sm text-gray-600">
          一覧に戻る
        </Link>
      </div>

      <article className="flex w-full max-w-2xl flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-500">{LIKE_STATUS_LABELS[like.status]}</span>
          <h1 className="text-2xl font-semibold">{like.user.name}</h1>
          <span className="text-sm text-gray-600">{calculateAge(like.user.birth_date)}歳</span>
          <span className="text-xs text-gray-500">{LIKE_TYPE_LABELS[like.like_type]}</span>
          {like.user.comment && (
            <p className="whitespace-pre-wrap text-sm text-gray-600">{like.user.comment}</p>
          )}
          {like.user.portfolio_url && (
            <a
              href={like.user.portfolio_url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-600 underline"
            >
              {like.user.portfolio_url}
            </a>
          )}
        </div>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-medium">志望動機</h2>
          <p className="whitespace-pre-wrap text-sm text-gray-700">{like.motivation}</p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-medium">職務経歴</h2>
          {like.user.work_experiences.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {like.user.work_experiences.map((workExperience) => (
                <li key={workExperience.id} className="rounded border p-4">
                  <p className="font-medium">{workExperience.company_name}</p>
                  <div className="flex gap-3 text-sm text-gray-600">
                    <span>{EMPLOYMENT_TYPE_LABELS[workExperience.employment_type]}</span>
                    <span>
                      {workExperience.started_on.slice(0, 10)} 〜{" "}
                      {workExperience.ended_on ? workExperience.ended_on.slice(0, 10) : "現在"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">登録された職務経歴はありません</p>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-medium">学歴</h2>
          {like.user.educations.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {like.user.educations.map((education) => (
                <li key={education.id} className="rounded border p-4">
                  <p className="font-medium">{education.school_name}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">登録された学歴はありません</p>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-medium">資格</h2>
          {like.user.certifications.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {like.user.certifications.map((certification) => (
                <li key={certification.id} className="rounded border p-4">
                  <p className="font-medium">{certification.name}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">登録された資格はありません</p>
          )}
        </section>

        <div className="flex flex-col gap-1 text-sm text-gray-600">
          <span>応募日時: {formatDateTime(like.applied_at)}</span>
          {like.status === "applied" && (
            <span>反応期限: {formatDateTime(like.response_deadline)}</span>
          )}
        </div>

        {like.status === "applied" && (
          <div className="flex flex-col gap-2">
            {matchError && <p className="text-sm text-red-600">{matchError}</p>}
            <button
              type="button"
              onClick={() => {
                setMatchError(null);
                matchMutation.mutate();
              }}
              disabled={!canMatch || matchMutation.isPending}
              className="w-fit rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {canMatch ? "マッチする" : "反応期限切れ"}
            </button>
          </div>
        )}
      </article>
    </main>
  );
}

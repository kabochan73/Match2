"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { userMeQueryOptions } from "@/lib/auth/users";
import { workExperiencesQueryOptions } from "@/lib/work-experiences/api";
import { EMPLOYMENT_TYPE_OPTIONS } from "@/lib/work-experiences/schemas";
import { educationsQueryOptions } from "@/lib/educations/api";
import { certificationsQueryOptions } from "@/lib/certifications/api";

const EMPLOYMENT_TYPE_LABELS = Object.fromEntries(
  EMPLOYMENT_TYPE_OPTIONS.map((option) => [option.value, option.label]),
);

export default function MyPage() {
  const { data: user } = useQuery(userMeQueryOptions);
  const { data: workExperiences } = useQuery(workExperiencesQueryOptions);
  const { data: educations } = useQuery(educationsQueryOptions);
  const { data: certifications } = useQuery(certificationsQueryOptions);

  if (!user) return null;

  return (
    <main className="flex w-full flex-1 flex-col items-center gap-10 py-8">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <h1 className="text-2xl font-semibold">マイページ</h1>
        <Link href="/mypage/edit" className="rounded border px-4 py-2 text-sm">
          編集する
        </Link>
      </div>

      <section className="flex w-full max-w-2xl flex-col gap-2">
        <h2 className="text-lg font-medium">基本情報</h2>
        <p className="font-medium">{user.name}</p>
        {user.comment && (
          <p className="whitespace-pre-wrap text-sm text-gray-600">{user.comment}</p>
        )}
        {user.portfolio_url && (
          <a
            href={user.portfolio_url}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-600 underline"
          >
            {user.portfolio_url}
          </a>
        )}
      </section>

      <section className="flex w-full max-w-2xl flex-col gap-3">
        <h2 className="text-lg font-medium">職務経歴</h2>
        {workExperiences && workExperiences.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {workExperiences.map((workExperience) => (
              <li key={workExperience.id} className="rounded border p-4">
                <p className="font-medium">{workExperience.company_name}</p>
                <p className="text-sm text-gray-600">
                  {EMPLOYMENT_TYPE_LABELS[workExperience.employment_type]}
                </p>
                <p className="text-sm text-gray-600">
                  {workExperience.started_on.slice(0, 10)} 〜{" "}
                  {workExperience.ended_on ? workExperience.ended_on.slice(0, 10) : "現在"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">登録された職務経歴はありません</p>
        )}
      </section>

      <section className="flex w-full max-w-2xl flex-col gap-3">
        <h2 className="text-lg font-medium">学歴</h2>
        {educations && educations.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {educations.map((education) => (
              <li key={education.id} className="rounded border p-4">
                <p className="font-medium">{education.school_name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">登録された学歴はありません</p>
        )}
      </section>

      <section className="flex w-full max-w-2xl flex-col gap-3">
        <h2 className="text-lg font-medium">資格</h2>
        {certifications && certifications.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {certifications.map((certification) => (
              <li key={certification.id} className="rounded border p-4">
                <p className="font-medium">{certification.name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">登録された資格はありません</p>
        )}
      </section>
    </main>
  );
}

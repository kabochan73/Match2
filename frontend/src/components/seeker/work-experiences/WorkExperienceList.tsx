"use client";

import { useState } from "react";
import type { WorkExperience } from "@/lib/api/types";
import {
  EMPLOYMENT_TYPE_OPTIONS,
  type WorkExperienceInput,
} from "@/lib/work-experiences/schemas";
import { WorkExperienceForm } from "./WorkExperienceForm";

const EMPLOYMENT_TYPE_LABELS = Object.fromEntries(
  EMPLOYMENT_TYPE_OPTIONS.map((option) => [option.value, option.label]),
);

type WorkExperienceListProps = {
  workExperiences: WorkExperience[];
  onUpdate: (id: number, data: WorkExperienceInput) => Promise<unknown>;
  onDelete: (id: number) => Promise<unknown>;
};

export function WorkExperienceList({
  workExperiences,
  onUpdate,
  onDelete,
}: WorkExperienceListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);

  if (workExperiences.length === 0) {
    return <p className="text-sm text-gray-500">登録された職務経歴はありません</p>;
  }

  return (
    <ul className="flex w-full max-w-sm flex-col gap-4">
      {workExperiences.map((workExperience) => (
        <li key={workExperience.id} className="rounded border p-4">
          {editingId === workExperience.id ? (
            <WorkExperienceForm
              submitLabel="更新する"
              defaultValues={{
                company_name: workExperience.company_name,
                started_on: workExperience.started_on.slice(0, 10),
                ended_on: workExperience.ended_on?.slice(0, 10) ?? "",
                employment_type: workExperience.employment_type,
              }}
              onSubmit={async (data) => {
                await onUpdate(workExperience.id, data);
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className="flex flex-col gap-1">
              <p className="font-medium">{workExperience.company_name}</p>
              <p className="text-sm text-gray-600">
                {EMPLOYMENT_TYPE_LABELS[workExperience.employment_type]}
              </p>
              <p className="text-sm text-gray-600">
                {workExperience.started_on.slice(0, 10)} 〜{" "}
                {workExperience.ended_on ? workExperience.ended_on.slice(0, 10) : "現在"}
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingId(workExperience.id)}
                  className="rounded border px-3 py-1 text-sm"
                >
                  編集
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("この職務経歴を削除しますか?")) {
                      void onDelete(workExperience.id);
                    }
                  }}
                  className="rounded border border-red-600 px-3 py-1 text-sm text-red-600"
                >
                  削除
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

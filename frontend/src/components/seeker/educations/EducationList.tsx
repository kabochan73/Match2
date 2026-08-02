"use client";

import { useState } from "react";
import type { Education } from "@/lib/api/types";
import type { EducationInput } from "@/lib/seeker/educations/schemas";
import { EducationForm } from "./EducationForm";

type EducationListProps = {
  educations: Education[];
  onUpdate: (id: number, data: EducationInput) => Promise<unknown>;
  onDelete: (id: number) => Promise<unknown>;
};

export function EducationList({ educations, onUpdate, onDelete }: EducationListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);

  if (educations.length === 0) {
    return <p className="text-sm text-gray-500">登録された学歴はありません</p>;
  }

  return (
    <ul className="flex w-full max-w-sm flex-col gap-4">
      {educations.map((education) => (
        <li key={education.id} className="rounded border p-4">
          {editingId === education.id ? (
            <EducationForm
              submitLabel="更新する"
              defaultValues={{ school_name: education.school_name }}
              onSubmit={async (data) => {
                await onUpdate(education.id, data);
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className="flex flex-col gap-1">
              <p className="font-medium">{education.school_name}</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingId(education.id)}
                  className="rounded border px-3 py-1 text-sm"
                >
                  編集
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("この学歴を削除しますか?")) {
                      void onDelete(education.id);
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

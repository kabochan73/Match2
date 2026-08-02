"use client";

import { useState } from "react";
import type { Certification } from "@/lib/api/types";
import type { CertificationInput } from "@/lib/certifications/schemas";
import { CertificationForm } from "./CertificationForm";

type CertificationListProps = {
  certifications: Certification[];
  onUpdate: (id: number, data: CertificationInput) => Promise<unknown>;
  onDelete: (id: number) => Promise<unknown>;
};

export function CertificationList({
  certifications,
  onUpdate,
  onDelete,
}: CertificationListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);

  if (certifications.length === 0) {
    return <p className="text-sm text-gray-500">登録された資格はありません</p>;
  }

  return (
    <ul className="flex w-full max-w-sm flex-col gap-4">
      {certifications.map((certification) => (
        <li key={certification.id} className="rounded border p-4">
          {editingId === certification.id ? (
            <CertificationForm
              submitLabel="更新する"
              defaultValues={{ name: certification.name }}
              onSubmit={async (data) => {
                await onUpdate(certification.id, data);
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className="flex flex-col gap-1">
              <p className="font-medium">{certification.name}</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingId(certification.id)}
                  className="rounded border px-3 py-1 text-sm"
                >
                  編集
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("この資格を削除しますか?")) {
                      void onDelete(certification.id);
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

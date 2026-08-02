"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EducationForm } from "@/components/educations/EducationForm";
import { EducationList } from "@/components/educations/EducationList";
import {
  createEducation,
  deleteEducation,
  educationsQueryKey,
  educationsQueryOptions,
  updateEducation,
} from "@/lib/educations/api";
import type { EducationInput } from "@/lib/educations/schemas";

export default function EducationsPage() {
  const queryClient = useQueryClient();
  const { data: educations } = useQuery(educationsQueryOptions);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: educationsQueryKey });

  const createMutation = useMutation({
    mutationFn: createEducation,
    onSuccess: invalidate,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EducationInput }) =>
      updateEducation(id, data),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteEducation,
    onSuccess: invalidate,
  });

  return (
    <main className="flex w-full flex-1 flex-col items-center gap-8">
      <h1 className="text-2xl font-semibold">学歴</h1>

      <EducationList
        educations={educations ?? []}
        onUpdate={(id, data) => updateMutation.mutateAsync({ id, data })}
        onDelete={(id) => deleteMutation.mutateAsync(id)}
      />

      <section className="flex w-full max-w-sm flex-col gap-2">
        <h2 className="text-lg font-medium">学歴を追加</h2>
        <EducationForm
          submitLabel="追加する"
          onSubmit={(data) => createMutation.mutateAsync(data)}
        />
      </section>
    </main>
  );
}

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WorkExperienceForm } from "@/components/work-experiences/WorkExperienceForm";
import { WorkExperienceList } from "@/components/work-experiences/WorkExperienceList";
import {
  createWorkExperience,
  deleteWorkExperience,
  updateWorkExperience,
  workExperiencesQueryKey,
  workExperiencesQueryOptions,
} from "@/lib/work-experiences/api";
import type { WorkExperienceInput } from "@/lib/work-experiences/schemas";

export default function WorkExperiencesPage() {
  const queryClient = useQueryClient();
  const { data: workExperiences } = useQuery(workExperiencesQueryOptions);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: workExperiencesQueryKey });

  const createMutation = useMutation({
    mutationFn: createWorkExperience,
    onSuccess: invalidate,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: WorkExperienceInput }) =>
      updateWorkExperience(id, data),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteWorkExperience,
    onSuccess: invalidate,
  });

  return (
    <main className="flex w-full flex-1 flex-col items-center gap-8">
      <h1 className="text-2xl font-semibold">職務経歴</h1>

      <WorkExperienceList
        workExperiences={workExperiences ?? []}
        onUpdate={(id, data) => updateMutation.mutateAsync({ id, data })}
        onDelete={(id) => deleteMutation.mutateAsync(id)}
      />

      <section className="flex w-full max-w-sm flex-col gap-2">
        <h2 className="text-lg font-medium">職務経歴を追加</h2>
        <WorkExperienceForm
          submitLabel="追加する"
          onSubmit={(data) => createMutation.mutateAsync(data)}
        />
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProfileForm } from "@/components/seeker/profile/ProfileForm";
import { WorkExperienceForm } from "@/components/seeker/work-experiences/WorkExperienceForm";
import { WorkExperienceList } from "@/components/seeker/work-experiences/WorkExperienceList";
import { EducationForm } from "@/components/seeker/educations/EducationForm";
import { EducationList } from "@/components/seeker/educations/EducationList";
import { CertificationForm } from "@/components/seeker/certifications/CertificationForm";
import { CertificationList } from "@/components/seeker/certifications/CertificationList";
import { updateUserProfile, userMeQueryKey, userMeQueryOptions } from "@/lib/seeker/users";
import {
  createWorkExperience,
  deleteWorkExperience,
  updateWorkExperience,
  workExperiencesQueryKey,
  workExperiencesQueryOptions,
} from "@/lib/seeker/work-experiences/api";
import type { WorkExperienceInput } from "@/lib/seeker/work-experiences/schemas";
import {
  createEducation,
  deleteEducation,
  educationsQueryKey,
  educationsQueryOptions,
  updateEducation,
} from "@/lib/seeker/educations/api";
import type { EducationInput } from "@/lib/seeker/educations/schemas";
import {
  certificationsQueryKey,
  certificationsQueryOptions,
  createCertification,
  deleteCertification,
  updateCertification,
} from "@/lib/seeker/certifications/api";
import type { CertificationInput } from "@/lib/seeker/certifications/schemas";

export function MyPageEditView() {
  const queryClient = useQueryClient();
  const { data: user } = useQuery(userMeQueryOptions);
  const { data: workExperiences } = useQuery(workExperiencesQueryOptions);
  const { data: educations } = useQuery(educationsQueryOptions);
  const { data: certifications } = useQuery(certificationsQueryOptions);

  const createWorkExperienceMutation = useMutation({
    mutationFn: createWorkExperience,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: workExperiencesQueryKey }),
  });
  const updateWorkExperienceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: WorkExperienceInput }) =>
      updateWorkExperience(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: workExperiencesQueryKey }),
  });
  const deleteWorkExperienceMutation = useMutation({
    mutationFn: deleteWorkExperience,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: workExperiencesQueryKey }),
  });

  const createEducationMutation = useMutation({
    mutationFn: createEducation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: educationsQueryKey }),
  });
  const updateEducationMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EducationInput }) => updateEducation(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: educationsQueryKey }),
  });
  const deleteEducationMutation = useMutation({
    mutationFn: deleteEducation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: educationsQueryKey }),
  });

  const createCertificationMutation = useMutation({
    mutationFn: createCertification,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: certificationsQueryKey }),
  });
  const updateCertificationMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CertificationInput }) =>
      updateCertification(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: certificationsQueryKey }),
  });
  const deleteCertificationMutation = useMutation({
    mutationFn: deleteCertification,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: certificationsQueryKey }),
  });

  if (!user) return null;

  return (
    <main className="flex w-full flex-1 flex-col items-center gap-10 py-8">
      <div className="flex w-full max-w-sm items-center justify-between">
        <h1 className="text-2xl font-semibold">マイページ編集</h1>
        <Link href="/mypage" className="text-sm text-gray-600">
          マイページに戻る
        </Link>
      </div>

      <section className="flex w-full max-w-sm flex-col gap-2">
        <h2 className="text-lg font-medium">基本情報</h2>
        <ProfileForm
          defaultValues={{
            name: user.name,
            comment: user.comment ?? "",
            portfolio_url: user.portfolio_url ?? "",
            birth_date: user.birth_date.slice(0, 10),
          }}
          onSubmit={async (data) => {
            const updated = await updateUserProfile(data);
            queryClient.setQueryData(userMeQueryKey, updated);
          }}
        />
      </section>

      <section className="flex w-full max-w-sm flex-col gap-4">
        <h2 className="text-lg font-medium">職務経歴</h2>
        <WorkExperienceList
          workExperiences={workExperiences ?? []}
          onUpdate={(id, data) => updateWorkExperienceMutation.mutateAsync({ id, data })}
          onDelete={(id) => deleteWorkExperienceMutation.mutateAsync(id)}
        />
        <WorkExperienceForm
          submitLabel="追加する"
          onSubmit={(data) => createWorkExperienceMutation.mutateAsync(data)}
        />
      </section>

      <section className="flex w-full max-w-sm flex-col gap-4">
        <h2 className="text-lg font-medium">学歴</h2>
        <EducationList
          educations={educations ?? []}
          onUpdate={(id, data) => updateEducationMutation.mutateAsync({ id, data })}
          onDelete={(id) => deleteEducationMutation.mutateAsync(id)}
        />
        <EducationForm
          submitLabel="追加する"
          onSubmit={(data) => createEducationMutation.mutateAsync(data)}
        />
      </section>

      <section className="flex w-full max-w-sm flex-col gap-4">
        <h2 className="text-lg font-medium">資格</h2>
        <CertificationList
          certifications={certifications ?? []}
          onUpdate={(id, data) => updateCertificationMutation.mutateAsync({ id, data })}
          onDelete={(id) => deleteCertificationMutation.mutateAsync(id)}
        />
        <CertificationForm
          submitLabel="追加する"
          onSubmit={(data) => createCertificationMutation.mutateAsync(data)}
        />
      </section>
    </main>
  );
}

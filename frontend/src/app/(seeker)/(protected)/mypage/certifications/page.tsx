"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CertificationForm } from "@/components/certifications/CertificationForm";
import { CertificationList } from "@/components/certifications/CertificationList";
import {
  certificationsQueryKey,
  certificationsQueryOptions,
  createCertification,
  deleteCertification,
  updateCertification,
} from "@/lib/certifications/api";
import type { CertificationInput } from "@/lib/certifications/schemas";

export default function CertificationsPage() {
  const queryClient = useQueryClient();
  const { data: certifications } = useQuery(certificationsQueryOptions);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: certificationsQueryKey });

  const createMutation = useMutation({
    mutationFn: createCertification,
    onSuccess: invalidate,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CertificationInput }) =>
      updateCertification(id, data),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteCertification,
    onSuccess: invalidate,
  });

  return (
    <main className="flex w-full flex-1 flex-col items-center gap-8">
      <h1 className="text-2xl font-semibold">資格</h1>

      <CertificationList
        certifications={certifications ?? []}
        onUpdate={(id, data) => updateMutation.mutateAsync({ id, data })}
        onDelete={(id) => deleteMutation.mutateAsync(id)}
      />

      <section className="flex w-full max-w-sm flex-col gap-2">
        <h2 className="text-lg font-medium">資格を追加</h2>
        <CertificationForm
          submitLabel="追加する"
          onSubmit={(data) => createMutation.mutateAsync(data)}
        />
      </section>
    </main>
  );
}

import { apiClientFetch } from "@/lib/api/client";
import type { Certification } from "@/lib/api/types";
import type { CertificationInput } from "./schemas";

export const certificationsQueryKey = ["users", "certifications"] as const;

export function fetchCertifications(): Promise<Certification[]> {
  return apiClientFetch<Certification[]>("/api/users/certifications");
}

export const certificationsQueryOptions = {
  queryKey: certificationsQueryKey,
  queryFn: fetchCertifications,
};

export function createCertification(input: CertificationInput): Promise<Certification> {
  return apiClientFetch<Certification>("/api/users/certifications", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateCertification(
  id: number,
  input: CertificationInput,
): Promise<Certification> {
  return apiClientFetch<Certification>(`/api/users/certifications/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteCertification(id: number): Promise<void> {
  return apiClientFetch<void>(`/api/users/certifications/${id}`, {
    method: "DELETE",
  });
}

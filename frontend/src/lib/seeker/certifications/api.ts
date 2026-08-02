import { apiClientFetch } from "@/lib/api/client";
import type { Certification } from "@/lib/api/types";
import type { CertificationInput } from "./schemas";

export const certificationsQueryKey = ["users", "certifications"] as const;

export function fetchCertifications(): Promise<Certification[]> {
  return apiClientFetch<Certification[]>("/api/users/certifications");
}

// Changes only through this app's own mutations (which invalidate this key),
// so no background refetching is needed.
export const certificationsQueryOptions = {
  queryKey: certificationsQueryKey,
  queryFn: fetchCertifications,
  staleTime: Infinity,
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

import { apiClientFetch } from "@/lib/api/client";
import type { Education } from "@/lib/api/types";
import type { EducationInput } from "./schemas";

export const educationsQueryKey = ["users", "educations"] as const;

export function fetchEducations(): Promise<Education[]> {
  return apiClientFetch<Education[]>("/api/users/educations");
}

// Changes only through this app's own mutations (which invalidate this key),
// so no background refetching is needed.
export const educationsQueryOptions = {
  queryKey: educationsQueryKey,
  queryFn: fetchEducations,
  staleTime: Infinity,
};

export function createEducation(input: EducationInput): Promise<Education> {
  return apiClientFetch<Education>("/api/users/educations", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateEducation(id: number, input: EducationInput): Promise<Education> {
  return apiClientFetch<Education>(`/api/users/educations/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteEducation(id: number): Promise<void> {
  return apiClientFetch<void>(`/api/users/educations/${id}`, {
    method: "DELETE",
  });
}

import { apiClientFetch } from "@/lib/api/client";
import type { WorkExperience } from "@/lib/api/types";
import type { WorkExperienceInput } from "./schemas";

export const workExperiencesQueryKey = ["users", "work-experiences"] as const;

export function fetchWorkExperiences(): Promise<WorkExperience[]> {
  return apiClientFetch<WorkExperience[]>("/api/users/work-experiences");
}

// Changes only through this app's own mutations (which invalidate this key),
// so no background refetching is needed.
export const workExperiencesQueryOptions = {
  queryKey: workExperiencesQueryKey,
  queryFn: fetchWorkExperiences,
  staleTime: Infinity,
};

function toPayload(input: WorkExperienceInput) {
  return {
    company_name: input.company_name,
    started_on: input.started_on,
    ended_on: input.ended_on || null,
    employment_type: input.employment_type,
  };
}

export function createWorkExperience(input: WorkExperienceInput): Promise<WorkExperience> {
  return apiClientFetch<WorkExperience>("/api/users/work-experiences", {
    method: "POST",
    body: JSON.stringify(toPayload(input)),
  });
}

export function updateWorkExperience(
  id: number,
  input: WorkExperienceInput,
): Promise<WorkExperience> {
  return apiClientFetch<WorkExperience>(`/api/users/work-experiences/${id}`, {
    method: "PUT",
    body: JSON.stringify(toPayload(input)),
  });
}

export function deleteWorkExperience(id: number): Promise<void> {
  return apiClientFetch<void>(`/api/users/work-experiences/${id}`, {
    method: "DELETE",
  });
}

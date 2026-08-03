import { apiClientFetch } from "@/lib/api/client";
import type { CompanyJobPosting } from "@/lib/api/types";
import type { JobPostingInput } from "./schemas";

export const companyJobPostingsQueryKey = ["companies", "job-postings"] as const;

export function fetchCompanyJobPostings(): Promise<CompanyJobPosting[]> {
  return apiClientFetch<CompanyJobPosting[]>("/api/companies/job-postings");
}

// Changes only through this app's own mutations (which invalidate this key),
// so no background refetching is needed.
export const companyJobPostingsQueryOptions = {
  queryKey: companyJobPostingsQueryKey,
  queryFn: fetchCompanyJobPostings,
  staleTime: Infinity,
};

export function companyJobPostingQueryKey(id: number) {
  return ["companies", "job-postings", id] as const;
}

export function fetchCompanyJobPosting(id: number): Promise<CompanyJobPosting> {
  return apiClientFetch<CompanyJobPosting>(`/api/companies/job-postings/${id}`);
}

// フォームは万円単位で入力を受け取り、DB(円単位)へ変換して送信する
function manToYen(value: string | undefined): number | null {
  return value === "" || value === undefined ? null : Number(value) * 10000;
}

function toPayload(input: JobPostingInput) {
  return {
    title: input.title,
    description: input.description,
    desired_candidate: input.desired_candidate || null,
    employment_type: input.employment_type,
    prefecture: input.prefecture,
    salary_min: manToYen(input.salary_min),
    salary_max: manToYen(input.salary_max),
  };
}

export function createCompanyJobPosting(input: JobPostingInput): Promise<CompanyJobPosting> {
  return apiClientFetch<CompanyJobPosting>("/api/companies/job-postings", {
    method: "POST",
    body: JSON.stringify(toPayload(input)),
  });
}

export function updateCompanyJobPosting(
  id: number,
  input: JobPostingInput,
): Promise<CompanyJobPosting> {
  return apiClientFetch<CompanyJobPosting>(`/api/companies/job-postings/${id}`, {
    method: "PUT",
    body: JSON.stringify(toPayload(input)),
  });
}

export function deleteCompanyJobPosting(id: number): Promise<void> {
  return apiClientFetch<void>(`/api/companies/job-postings/${id}`, {
    method: "DELETE",
  });
}

export function publishCompanyJobPosting(id: number): Promise<CompanyJobPosting> {
  return apiClientFetch<CompanyJobPosting>(`/api/companies/job-postings/${id}/publish`, {
    method: "PATCH",
  });
}

export function closeCompanyJobPosting(id: number): Promise<CompanyJobPosting> {
  return apiClientFetch<CompanyJobPosting>(`/api/companies/job-postings/${id}/close`, {
    method: "PATCH",
  });
}

import { apiPublicFetch } from "@/lib/api/server";
import type { JobPosting, PaginatedResponse } from "@/lib/api/types";

export type JobPostingFilters = {
  keyword?: string;
  prefecture?: string;
  employment_type?: string;
  page?: number;
};

export function fetchJobPostings(
  filters: JobPostingFilters,
): Promise<PaginatedResponse<JobPosting>> {
  const params = new URLSearchParams();
  if (filters.keyword) params.set("keyword", filters.keyword);
  if (filters.prefecture) params.set("prefecture", filters.prefecture);
  if (filters.employment_type) params.set("employment_type", filters.employment_type);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));

  const query = params.toString();

  return apiPublicFetch<PaginatedResponse<JobPosting>>(
    `/api/job-postings${query ? `?${query}` : ""}`,
    { next: { revalidate: false, tags: ["job-postings"] } },
  );
}

export function fetchJobPosting(id: string): Promise<JobPosting> {
  return apiPublicFetch<JobPosting>(`/api/job-postings/${id}`, {
    next: { revalidate: false, tags: [`job-posting-${id}`] },
  });
}

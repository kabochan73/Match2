import { apiClientFetch } from "@/lib/api/client";
import type { CandidateProfile, CompanyLike, Message } from "@/lib/api/types";

export const companyLikesBaseKey = ["companies", "likes", "list"] as const;

export function companyLikesQueryKey(jobPostingId?: number) {
  return [...companyLikesBaseKey, jobPostingId ?? null] as const;
}

export function fetchCompanyLikes(jobPostingId?: number): Promise<CompanyLike[]> {
  const query = jobPostingId ? `?job_posting_id=${jobPostingId}` : "";
  return apiClientFetch<CompanyLike[]>(`/api/companies/likes${query}`);
}

// Changes only through this app's own mutations (which invalidate companyLikesBaseKey),
// so no background refetching is needed.
export function companyLikesQueryOptions(jobPostingId?: number) {
  return {
    queryKey: companyLikesQueryKey(jobPostingId),
    queryFn: () => fetchCompanyLikes(jobPostingId),
    staleTime: Infinity,
  };
}

export function companyLikeQueryKey(id: number) {
  return ["companies", "likes", id] as const;
}

export function fetchCompanyLike(id: number): Promise<CandidateProfile> {
  return apiClientFetch<CandidateProfile>(`/api/companies/likes/${id}`);
}

export function matchCompanyLike(id: number): Promise<void> {
  return apiClientFetch<void>(`/api/companies/likes/${id}/match`, {
    method: "PATCH",
  }).then(() => undefined);
}

export function companyLikeMessagesQueryKey(likeId: number) {
  return ["companies", "likes", likeId, "messages"] as const;
}

export function fetchCompanyLikeMessages(likeId: number): Promise<Message[]> {
  return apiClientFetch<Message[]>(`/api/companies/likes/${likeId}/messages`);
}

export function sendCompanyLikeMessage(likeId: number, body: string): Promise<Message> {
  return apiClientFetch<Message>(`/api/companies/likes/${likeId}/messages`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

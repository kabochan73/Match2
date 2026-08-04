import { apiClientFetch } from "@/lib/api/client";
import type { CandidateProfile, CompanyLike, Message } from "@/lib/api/types";

export const companyLikesQueryKey = ["companies", "likes"] as const;

export function fetchCompanyLikes(): Promise<CompanyLike[]> {
  return apiClientFetch<CompanyLike[]>("/api/companies/likes");
}

// Changes only through this app's own mutations (which invalidate this key),
// so no background refetching is needed.
export const companyLikesQueryOptions = {
  queryKey: companyLikesQueryKey,
  queryFn: fetchCompanyLikes,
  staleTime: Infinity,
};

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

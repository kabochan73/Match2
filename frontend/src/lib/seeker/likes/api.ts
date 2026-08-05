import { apiClientFetch } from "@/lib/api/client";
import type { Like, LikeRemaining, Message } from "@/lib/api/types";
import type { ApplyLikeInput } from "./schemas";

export const seekerLikesQueryKey = ["likes"] as const;

export function fetchSeekerLikes(): Promise<Like[]> {
  return apiClientFetch<Like[]>("/api/users/likes");
}

export function createSeekerLike(
  input: ApplyLikeInput & { job_posting_id: number },
): Promise<Like> {
  return apiClientFetch<Like>("/api/users/likes", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// Changes only through this app's own mutations (which invalidate this key),
// so no background refetching is needed.
export const seekerLikesQueryOptions = {
  queryKey: seekerLikesQueryKey,
  queryFn: fetchSeekerLikes,
  staleTime: Infinity,
};

export const seekerLikesRemainingQueryKey = ["likes", "remaining"] as const;

export function fetchSeekerLikesRemaining(): Promise<LikeRemaining> {
  return apiClientFetch<LikeRemaining>("/api/users/likes/remaining");
}

// Changes only when a like is created (which invalidates this key), so no
// background refetching is needed.
export const seekerLikesRemainingQueryOptions = {
  queryKey: seekerLikesRemainingQueryKey,
  queryFn: fetchSeekerLikesRemaining,
  staleTime: Infinity,
};

export function seekerLikeQueryKey(id: number) {
  return ["likes", id] as const;
}

export function fetchSeekerLike(id: number): Promise<Like> {
  return apiClientFetch<Like>(`/api/users/likes/${id}`);
}

export function seekerLikeMessagesQueryKey(likeId: number) {
  return ["likes", likeId, "messages"] as const;
}

export function fetchSeekerLikeMessages(likeId: number): Promise<Message[]> {
  return apiClientFetch<Message[]>(`/api/users/likes/${likeId}/messages`);
}

export function sendSeekerLikeMessage(likeId: number, body: string): Promise<Message> {
  return apiClientFetch<Message>(`/api/users/likes/${likeId}/messages`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

import { apiClientFetch } from "@/lib/api/client";
import type { Like, Message } from "@/lib/api/types";

export const seekerLikesQueryKey = ["likes"] as const;

export function fetchSeekerLikes(): Promise<Like[]> {
  return apiClientFetch<Like[]>("/api/users/likes");
}

// Changes only through this app's own mutations (which invalidate this key),
// so no background refetching is needed.
export const seekerLikesQueryOptions = {
  queryKey: seekerLikesQueryKey,
  queryFn: fetchSeekerLikes,
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

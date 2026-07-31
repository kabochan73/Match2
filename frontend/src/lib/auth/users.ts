import { apiClientFetch } from "@/lib/api/client";
import type { User } from "@/lib/api/types";

export const userMeQueryKey = ["auth", "users", "me"] as const;

export function fetchCurrentUser(): Promise<User> {
  return apiClientFetch<User>("/api/users/me");
}

// Identity rarely changes mid-session; a manual invalidateQueries call
// after login/logout/profile updates keeps this in sync instead of polling.
export const userMeQueryOptions = {
  queryKey: userMeQueryKey,
  queryFn: fetchCurrentUser,
  staleTime: Infinity,
};

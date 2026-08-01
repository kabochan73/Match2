import { apiClientFetch } from "@/lib/api/client";
import type { User } from "@/lib/api/types";
import type { LoginInput, ProfileInput, RegisterInput } from "./schemas";

export const userMeQueryKey = ["auth", "users", "me"] as const;

export function fetchCurrentUser(): Promise<User> {
  return apiClientFetch<User>("/api/users/me");
}

export function loginUser(input: LoginInput): Promise<User> {
  return apiClientFetch<User>("/api/users/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function registerUser(input: RegisterInput): Promise<User> {
  return apiClientFetch<User>("/api/users/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateUserProfile(input: ProfileInput): Promise<User> {
  return apiClientFetch<User>("/api/users/profile", {
    method: "PUT",
    body: JSON.stringify({
      name: input.name,
      comment: input.comment || null,
      portfolio_url: input.portfolio_url || null,
    }),
  });
}

// Identity rarely changes mid-session; a manual invalidateQueries call
// after login/logout/profile updates keeps this in sync instead of polling.
export const userMeQueryOptions = {
  queryKey: userMeQueryKey,
  queryFn: fetchCurrentUser,
  staleTime: Infinity,
};

import { apiClientFetch } from "@/lib/api/client";
import type { User } from "@/lib/api/types";
import type { LoginInput, RegisterInput } from "./schemas";

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

// Identity rarely changes mid-session; a manual invalidateQueries call
// after login/logout/profile updates keeps this in sync instead of polling.
export const userMeQueryOptions = {
  queryKey: userMeQueryKey,
  queryFn: fetchCurrentUser,
  staleTime: Infinity,
};

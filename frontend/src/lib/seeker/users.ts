import { z } from "zod";
import { apiClientFetch } from "@/lib/api/client";
import type { User } from "@/lib/api/types";
import type { LoginInput, RegisterInput } from "@/lib/auth/schemas";

export const profileSchema = z.object({
  name: z
    .string()
    .min(1, "名前を入力してください")
    .max(50, "名前は50文字以内で入力してください"),
  comment: z
    .union([z.literal(""), z.string().max(200, "自己紹介は200文字以内で入力してください")])
    .optional(),
  portfolio_url: z
    .union([z.literal(""), z.string().url("URLの形式が正しくありません").max(255)])
    .optional(),
});
export type ProfileInput = z.infer<typeof profileSchema>;

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

export function logoutUser(): Promise<void> {
  return apiClientFetch<void>("/api/users/logout", { method: "POST" });
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
  // A 401 here just means "not logged in as a seeker" — retrying never helps.
  retry: false,
};

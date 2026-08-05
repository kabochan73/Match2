import { z } from "zod";
import { apiClientFetch } from "@/lib/api/client";
import type { User } from "@/lib/api/types";
import { registerSchema, type LoginInput } from "@/lib/auth/schemas";
import { calculateAge } from "@/lib/age";

const birthDateSchema = z
  .string()
  .min(1, "生年月日を入力してください")
  .refine((value) => calculateAge(value) >= 18 && calculateAge(value) <= 60, {
    message: "生年月日は18歳から60歳の範囲で入力してください",
  });

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
  birth_date: birthDateSchema,
});
export type ProfileInput = z.infer<typeof profileSchema>;

export const userRegisterSchema = registerSchema.extend({
  birth_date: birthDateSchema,
}).refine((data) => data.password === data.password_confirmation, {
  message: "パスワードが一致しません",
  path: ["password_confirmation"],
});
export type UserRegisterInput = z.infer<typeof userRegisterSchema>;

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

export function registerUser(input: UserRegisterInput): Promise<User> {
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
      birth_date: input.birth_date,
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

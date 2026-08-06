import { z } from "zod";
import { apiClientFetch } from "@/lib/api/client";
import type { Company } from "@/lib/api/types";
import { MEMBER_COUNT_RANGE_VALUES } from "@/lib/company/member-count-range";
import { PREFECTURES } from "@/lib/prefectures";
import type { LoginInput, RegisterInput } from "./schemas";

const currentYear = new Date().getFullYear();

export const companyProfileSchema = z.object({
  name: z
    .string()
    .min(1, "会社名を入力してください")
    .max(255, "会社名は255文字以内で入力してください"),
  description: z.union([z.literal(""), z.string()]).optional(),
  phone_number: z
    .union([z.literal(""), z.string().max(20, "電話番号は20文字以内で入力してください")])
    .optional(),
  prefecture: z.union([z.literal(""), z.enum(PREFECTURES)]).optional(),
  address_line: z
    .union([z.literal(""), z.string().max(255, "住所は255文字以内で入力してください")])
    .optional(),
  founded_year: z
    .union([z.literal(""), z.string().regex(/^\d+$/, "設立年は数字で入力してください")])
    .optional()
    .refine(
      (value) => !value || (Number(value) >= 1800 && Number(value) <= currentYear),
      "設立年が正しくありません",
    ),
  member_count_range: z.union([z.literal(""), z.enum(MEMBER_COUNT_RANGE_VALUES)]).optional(),
});
export type CompanyProfileInput = z.infer<typeof companyProfileSchema>;

export function updateCompanyProfile(input: CompanyProfileInput): Promise<Company> {
  return apiClientFetch<Company>("/api/companies/profile", {
    method: "PUT",
    body: JSON.stringify({
      name: input.name,
      description: input.description || null,
      phone_number: input.phone_number || null,
      prefecture: input.prefecture || null,
      address_line: input.address_line || null,
      founded_year: input.founded_year ? Number(input.founded_year) : null,
      member_count_range: input.member_count_range || null,
    }),
  });
}

export const companyMeQueryKey = ["auth", "companies", "me"] as const;

export function fetchCurrentCompany(): Promise<Company> {
  return apiClientFetch<Company>("/api/companies/me");
}

export function loginCompany(input: LoginInput): Promise<Company> {
  return apiClientFetch<Company>("/api/companies/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function registerCompany(input: RegisterInput): Promise<Company> {
  return apiClientFetch<Company>("/api/companies/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function logoutCompany(): Promise<void> {
  return apiClientFetch<void>("/api/companies/logout", { method: "POST" });
}

// Identity rarely changes mid-session; a manual invalidateQueries call
// after login/logout/profile updates keeps this in sync instead of polling.
export const companyMeQueryOptions = {
  queryKey: companyMeQueryKey,
  queryFn: fetchCurrentCompany,
  staleTime: Infinity,
  // A 401 here just means "not logged in as a company" — retrying never helps.
  retry: false,
};

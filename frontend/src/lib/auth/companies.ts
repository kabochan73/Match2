import { apiClientFetch } from "@/lib/api/client";
import type { Company } from "@/lib/api/types";
import type { LoginInput, RegisterInput } from "./schemas";

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

// Identity rarely changes mid-session; a manual invalidateQueries call
// after login/logout/profile updates keeps this in sync instead of polling.
export const companyMeQueryOptions = {
  queryKey: companyMeQueryKey,
  queryFn: fetchCurrentCompany,
  staleTime: Infinity,
};

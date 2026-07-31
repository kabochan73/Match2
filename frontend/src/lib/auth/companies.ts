import { apiClientFetch } from "@/lib/api/client";
import type { Company } from "@/lib/api/types";

export const companyMeQueryKey = ["auth", "companies", "me"] as const;

export function fetchCurrentCompany(): Promise<Company> {
  return apiClientFetch<Company>("/api/companies/me");
}

// Identity rarely changes mid-session; a manual invalidateQueries call
// after login/logout/profile updates keeps this in sync instead of polling.
export const companyMeQueryOptions = {
  queryKey: companyMeQueryKey,
  queryFn: fetchCurrentCompany,
  staleTime: Infinity,
};

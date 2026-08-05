import { apiPublicFetch } from "@/lib/api/server";
import type { CompanyProfile } from "@/lib/api/types";

export function fetchCompanyProfile(id: string): Promise<CompanyProfile> {
  return apiPublicFetch<CompanyProfile>(`/api/companies/${id}`, {
    next: { revalidate: false, tags: [`company-${id}`] },
  });
}

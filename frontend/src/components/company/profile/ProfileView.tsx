"use client";

import { useQuery } from "@tanstack/react-query";
import { companyMeQueryOptions } from "@/lib/auth/companies";
import { CompanyProfileDetails } from "@/components/company/profile/CompanyProfileDetails";

export function ProfileView() {
  const { data: company } = useQuery(companyMeQueryOptions);

  if (!company) return null;

  return <CompanyProfileDetails company={company} />;
}

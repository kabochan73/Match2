"use client";

import { useQuery } from "@tanstack/react-query";
import { userMeQueryOptions } from "@/lib/seeker/users";
import { companyMeQueryOptions } from "@/lib/auth/companies";
import { Header as PublicHeader } from "@/components/home/Header";
import { Header as SeekerHeader } from "@/components/seeker/Header";
import { Header as CompanyHeader } from "@/components/company/Header";

// /jobs and /jobs/[id] are public pages viewable by guests, seekers, and
// companies alike. The list/detail content stays a Server Component for
// caching, but which header to show depends on who's logged in — that
// check only exists client-side, so it's isolated to this component.
export function JobsHeader() {
  const { data: user } = useQuery(userMeQueryOptions);
  const { data: company } = useQuery(companyMeQueryOptions);

  if (user) return <SeekerHeader />;
  if (company) return <CompanyHeader />;
  return <PublicHeader />;
}

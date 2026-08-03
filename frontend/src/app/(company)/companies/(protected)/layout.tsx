import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { apiServerFetch } from "@/lib/api/server";
import { ApiError } from "@/lib/api/errors";
import type { Company } from "@/lib/api/types";
import { companyMeQueryKey } from "@/lib/auth/companies";
import { getQueryClient } from "@/lib/query/get-query-client";
import { Header } from "@/components/company/Header";

export default async function CompanyProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  try {
    await queryClient.fetchQuery({
      queryKey: companyMeQueryKey,
      queryFn: () => apiServerFetch<Company>("/api/companies/me"),
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/companies/login");
    }
    throw error;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Header />
      {children}
    </HydrationBoundary>
  );
}

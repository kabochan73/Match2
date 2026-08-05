"use client";

import { useQuery } from "@tanstack/react-query";
import { companyMeQueryOptions } from "@/lib/auth/companies";

export function DashboardView() {
  const { data: company } = useQuery(companyMeQueryOptions);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-semibold">企業ダッシュボード</h1>
      <p>{company?.name} 様、ようこそ</p>
    </main>
  );
}

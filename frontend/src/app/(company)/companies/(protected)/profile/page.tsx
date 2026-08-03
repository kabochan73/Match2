"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { companyMeQueryOptions } from "@/lib/auth/companies";

export default function CompanyProfilePage() {
  const { data: company } = useQuery(companyMeQueryOptions);

  if (!company) return null;

  return (
    <main className="flex w-full flex-1 flex-col items-center gap-10 py-8">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <h1 className="text-2xl font-semibold">企業プロフィール</h1>
        <Link href="/companies/profile/edit" className="rounded border px-4 py-2 text-sm">
          編集する
        </Link>
      </div>

      <section className="flex w-full max-w-2xl flex-col gap-2">
        <p className="font-medium">{company.name}</p>
        {company.description && (
          <p className="whitespace-pre-wrap text-sm text-gray-600">{company.description}</p>
        )}
        {company.phone_number && <p className="text-sm text-gray-600">{company.phone_number}</p>}
        {(company.prefecture || company.address_line) && (
          <p className="text-sm text-gray-600">
            {company.prefecture}
            {company.address_line}
          </p>
        )}
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CompanyProfileForm } from "@/components/company/profile/CompanyProfileForm";
import {
  companyMeQueryKey,
  companyMeQueryOptions,
  updateCompanyProfile,
  type CompanyProfileInput,
} from "@/lib/auth/companies";

export function ProfileEditView() {
  const queryClient = useQueryClient();
  const { data: company } = useQuery(companyMeQueryOptions);

  if (!company) return null;

  return (
    <main className="flex w-full flex-1 flex-col items-center gap-10 py-8">
      <div className="flex w-full max-w-sm items-center justify-between">
        <h1 className="text-2xl font-semibold">企業プロフィール編集</h1>
        <Link href="/companies/profile" className="text-sm text-gray-600">
          プロフィールに戻る
        </Link>
      </div>

      <CompanyProfileForm
        defaultValues={{
          name: company.name,
          description: company.description ?? "",
          phone_number: company.phone_number ?? "",
          prefecture: (company.prefecture as CompanyProfileInput["prefecture"]) ?? "",
          address_line: company.address_line ?? "",
        }}
        onSubmit={async (data) => {
          const updated = await updateCompanyProfile(data);
          queryClient.setQueryData(companyMeQueryKey, updated);
        }}
      />
    </main>
  );
}

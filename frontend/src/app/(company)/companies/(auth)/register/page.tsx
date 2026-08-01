"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { registerCompany, companyMeQueryKey } from "@/lib/auth/companies";

export default function CompanyRegisterPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-semibold">企業アカウント登録</h1>
      <RegisterForm
        loginHref="/companies/login"
        onSubmit={async (data) => {
          const company = await registerCompany(data);
          queryClient.setQueryData(companyMeQueryKey, company);
          router.push("/companies/profile");
        }}
      />
    </main>
  );
}

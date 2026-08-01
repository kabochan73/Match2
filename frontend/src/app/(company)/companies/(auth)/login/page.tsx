"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LoginForm } from "@/components/auth/LoginForm";
import { loginCompany, companyMeQueryKey } from "@/lib/auth/companies";

export default function CompanyLoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-semibold">企業ログイン</h1>
      <LoginForm
        registerHref="/companies/register"
        forgotPasswordHref="/companies/forgot-password"
        onSubmit={async (data) => {
          const company = await loginCompany(data);
          queryClient.setQueryData(companyMeQueryKey, company);
          router.push("/companies/profile");
        }}
      />
    </main>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { LoginForm } from "@/components/auth/LoginForm";
import { loginUser, userMeQueryKey } from "@/lib/seeker/users";

export default function SeekerLoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-semibold">ログイン</h1>
      <LoginForm
        registerHref="/register"
        forgotPasswordHref="/forgot-password"
        onSubmit={async (data) => {
          const user = await loginUser(data);
          queryClient.setQueryData(userMeQueryKey, user);
          router.push("/jobs");
        }}
      />
    </main>
  );
}

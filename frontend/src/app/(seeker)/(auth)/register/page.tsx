"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { registerUser, userMeQueryKey } from "@/lib/seeker/users";

export default function SeekerRegisterPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-semibold">会員登録</h1>
      <RegisterForm
        loginHref="/login"
        onSubmit={async (data) => {
          const user = await registerUser(data);
          queryClient.setQueryData(userMeQueryKey, user);
          router.push("/jobs");
        }}
      />
    </main>
  );
}

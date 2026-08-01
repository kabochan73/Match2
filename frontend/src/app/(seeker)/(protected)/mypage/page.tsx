"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { updateUserProfile, userMeQueryKey, userMeQueryOptions } from "@/lib/auth/users";

export default function MyPage() {
  const queryClient = useQueryClient();
  const { data: user } = useQuery(userMeQueryOptions);

  if (!user) return null;

  return (
    <main className="flex flex-1 flex-col items-center gap-6">
      <h1 className="text-2xl font-semibold">マイページ</h1>
      <ProfileForm
        defaultValues={{
          name: user.name,
          comment: user.comment ?? "",
          portfolio_url: user.portfolio_url ?? "",
        }}
        onSubmit={async (data) => {
          const updated = await updateUserProfile(data);
          queryClient.setQueryData(userMeQueryKey, updated);
        }}
      />
    </main>
  );
}

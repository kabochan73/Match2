"use client";

import { useQuery } from "@tanstack/react-query";
import { userMeQueryOptions } from "@/lib/auth/users";

export default function MyPage() {
  const { data: user } = useQuery(userMeQueryOptions);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-semibold">マイページ</h1>
      <p>{user?.name} さん、ようこそ</p>
    </main>
  );
}

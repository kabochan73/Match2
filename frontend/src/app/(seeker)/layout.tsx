import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { apiServerFetch } from "@/lib/api/server";
import { ApiError } from "@/lib/api/errors";
import type { User } from "@/lib/api/types";
import { userMeQueryKey } from "@/lib/auth/users";
import { getQueryClient } from "@/lib/query/get-query-client";

export default async function SeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  try {
    await queryClient.fetchQuery({
      queryKey: userMeQueryKey,
      queryFn: () => apiServerFetch<User>("/api/users/me"),
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login");
    }
    throw error;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}

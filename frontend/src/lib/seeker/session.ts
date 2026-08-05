import "server-only";
import { dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { apiServerFetch } from "@/lib/api/server";
import { ApiError } from "@/lib/api/errors";
import type { User } from "@/lib/api/types";
import { getQueryClient } from "@/lib/query/get-query-client";
import { userMeQueryKey } from "./users";

// Auth checks must run per-page, not in a shared layout: layouts don't
// re-render across sibling navigations (Next.js Partial Rendering), so a
// redirect decided once here would go stale right after the user logs in
// and clicks a nav link into this route group for the first time.
export async function requireSeekerSession() {
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

  return dehydrate(queryClient);
}

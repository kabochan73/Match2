"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "@/lib/seeker/users";

export function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear();
      router.push("/");
    },
  });

  return (
    <button
      type="button"
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
      className="rounded border px-3 py-1.5 text-sm disabled:opacity-50"
    >
      {logoutMutation.isPending ? "ログアウト中..." : "ログアウト"}
    </button>
  );
}

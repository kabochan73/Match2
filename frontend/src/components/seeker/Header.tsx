"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { logoutUser, userMeQueryOptions } from "@/lib/auth/users";

const NAV_LINKS = [
  { href: "/jobs", label: "求人を探す" },
  { href: "/likes", label: "いいね一覧" },
];

export function Header() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useQuery(userMeQueryOptions);

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear();
      router.push("/");
    },
  });

  return (
    <header className="flex w-full items-center justify-between border-b px-6 py-4">
      <Link href="/jobs" className="text-lg font-semibold">
        Match Portfolio
      </Link>

      <nav className="flex items-center gap-6 text-sm">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="text-gray-600">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4 text-sm">
        {user && (
          <Link href="/mypage" className="text-gray-600">
            {user.name} さん
          </Link>
        )}
        <button
          type="button"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="rounded border px-3 py-1.5 disabled:opacity-50"
        >
          {logoutMutation.isPending ? "ログアウト中..." : "ログアウト"}
        </button>
      </div>
    </header>
  );
}

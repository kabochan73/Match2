import Link from "next/link";
import { LogoutButton } from "./LogoutButton";
import { NotificationsNavLink } from "./NotificationsNavLink";

const NAV_LINKS = [
  { href: "/jobs", label: "求人を探す" },
  { href: "/companies/job-postings", label: "求人管理" },
  { href: "/companies/likes", label: "いいね一覧" },
  { href: "/companies/messages", label: "メッセージ" },
  { href: "/companies/profile", label: "企業プロフィール" },
];

export function Header() {
  return (
    <header className="flex w-full items-center justify-between border-b px-6 py-4">
      <Link href="/companies/dashboard" className="text-lg font-semibold">
        Match Portfolio
      </Link>

      <nav className="flex items-center gap-6 text-sm">
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="text-gray-600">
            {link.label}
          </Link>
        ))}
        <NotificationsNavLink />
      </nav>

      <LogoutButton />
    </header>
  );
}

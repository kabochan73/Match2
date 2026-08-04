import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

const NAV_LINKS = [
  { href: "/jobs", label: "求人を探す" },
  { href: "/likes", label: "いいね一覧" },
  { href: "/messages", label: "メッセージ" },
  { href: "/mypage", label: "マイページ" },
];

export function Header() {
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

      <LogoutButton />
    </header>
  );
}

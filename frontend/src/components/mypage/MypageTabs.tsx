"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/mypage", label: "基本情報" },
  { href: "/mypage/work-experiences", label: "職務経歴" },
  { href: "/mypage/educations", label: "学歴" },
  { href: "/mypage/certifications", label: "資格" },
];

export function MypageTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex w-full max-w-sm gap-4 border-b">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={
              isActive
                ? "border-b-2 border-black px-1 py-2 text-sm font-medium"
                : "px-1 py-2 text-sm text-gray-500"
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

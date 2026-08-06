import Link from "next/link";
import { MEMBER_COUNT_RANGE_LABELS } from "@/lib/company/member-count-range";
import type { JobPosting } from "@/lib/api/types";

export function CompanySidebar({ company }: { company: JobPosting["company"] }) {
  const address = [company.prefecture, company.address_line].filter(Boolean).join("");

  return (
    <aside className="flex w-full flex-col gap-3 rounded border p-4">
      <Link
        href={`/companies/${company.id}`}
        className="font-bold text-gray-900 hover:text-brand hover:underline"
      >
        {company.name}
      </Link>

      <dl className="flex flex-col gap-2 text-sm text-gray-600">
        {company.founded_year && (
          <div className="flex flex-col">
            <dt className="text-xs text-gray-400">設立年</dt>
            <dd>{company.founded_year}年</dd>
          </div>
        )}

        <div className="flex flex-col">
          <dt className="text-xs text-gray-400">メールアドレス</dt>
          <dd className="break-all">{company.email}</dd>
        </div>

        {address && (
          <div className="flex flex-col">
            <dt className="text-xs text-gray-400">住所</dt>
            <dd>{address}</dd>
          </div>
        )}

        {company.member_count_range && (
          <div className="flex flex-col">
            <dt className="text-xs text-gray-400">メンバー数</dt>
            <dd>{MEMBER_COUNT_RANGE_LABELS[company.member_count_range]}</dd>
          </div>
        )}
      </dl>
    </aside>
  );
}

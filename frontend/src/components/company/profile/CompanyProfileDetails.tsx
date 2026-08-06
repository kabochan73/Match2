import { MEMBER_COUNT_RANGE_LABELS } from "@/lib/company/member-count-range";
import type { MemberCountRange } from "@/lib/api/types";

type CompanyProfileDetailsProps = {
  company: {
    name: string;
    email: string;
    description: string | null;
    phone_number?: string | null;
    prefecture: string | null;
    address_line: string | null;
    founded_year: number | null;
    member_count_range: MemberCountRange | null;
  };
};

export function CompanyProfileDetails({ company }: CompanyProfileDetailsProps) {
  return (
    <section className="flex w-full max-w-2xl flex-col gap-2">
      <p className="font-medium">{company.name}</p>
      {company.description && (
        <p className="whitespace-pre-wrap text-sm text-gray-600">{company.description}</p>
      )}
      <p className="text-sm text-gray-600">{company.email}</p>
      {company.phone_number && <p className="text-sm text-gray-600">{company.phone_number}</p>}
      {(company.prefecture || company.address_line) && (
        <p className="text-sm text-gray-600">
          {company.prefecture}
          {company.address_line}
        </p>
      )}
      {company.founded_year && (
        <p className="text-sm text-gray-600">{company.founded_year}年設立</p>
      )}
      {company.member_count_range && (
        <p className="text-sm text-gray-600">
          {MEMBER_COUNT_RANGE_LABELS[company.member_count_range]}
        </p>
      )}
    </section>
  );
}

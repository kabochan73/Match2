type CompanyProfileDetailsProps = {
  company: {
    name: string;
    description: string | null;
    phone_number?: string | null;
    prefecture: string | null;
    address_line: string | null;
  };
};

export function CompanyProfileDetails({ company }: CompanyProfileDetailsProps) {
  return (
    <section className="flex w-full max-w-2xl flex-col gap-2">
      <p className="font-medium">{company.name}</p>
      {company.description && (
        <p className="whitespace-pre-wrap text-sm text-gray-600">{company.description}</p>
      )}
      {company.phone_number && <p className="text-sm text-gray-600">{company.phone_number}</p>}
      {(company.prefecture || company.address_line) && (
        <p className="text-sm text-gray-600">
          {company.prefecture}
          {company.address_line}
        </p>
      )}
    </section>
  );
}

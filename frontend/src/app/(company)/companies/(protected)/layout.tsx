import { Header } from "@/components/company/Header";

// Auth is enforced per-page (see lib/auth/company-session.ts), not here:
// layouts don't re-render on sibling navigations, so a check here would go stale.
export default function CompanyProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

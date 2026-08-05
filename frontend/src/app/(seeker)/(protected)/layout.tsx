import { Header } from "@/components/seeker/Header";

// Auth is enforced per-page (see lib/seeker/session.ts), not here: layouts
// don't re-render on sibling navigations, so a check here would go stale.
export default function SeekerProtectedLayout({
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

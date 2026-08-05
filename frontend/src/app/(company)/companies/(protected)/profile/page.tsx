import { HydrationBoundary } from "@tanstack/react-query";
import Link from "next/link";
import { requireCompanySession } from "@/lib/auth/company-session";
import { ProfileView } from "@/components/company/profile/ProfileView";

export default async function CompanyProfilePage() {
  const dehydratedState = await requireCompanySession();

  return (
    <HydrationBoundary state={dehydratedState}>
      <main className="flex w-full flex-1 flex-col items-center gap-10 py-8">
        <div className="flex w-full max-w-2xl items-center justify-between">
          <h1 className="text-2xl font-semibold">企業プロフィール</h1>
          <Link href="/companies/profile/edit" className="rounded border px-4 py-2 text-sm">
            編集する
          </Link>
        </div>

        <ProfileView />
      </main>
    </HydrationBoundary>
  );
}

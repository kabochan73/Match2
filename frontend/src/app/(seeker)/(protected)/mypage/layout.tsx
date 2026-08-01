import { MypageTabs } from "@/components/mypage/MypageTabs";

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-6 py-8">
      <MypageTabs />
      {children}
    </div>
  );
}

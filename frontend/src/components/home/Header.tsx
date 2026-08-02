import Link from "next/link";

export function Header() {
  return (
    <header className="flex w-full items-center justify-between border-b px-6 py-4">
      <Link href="/" className="text-lg font-semibold">
        Match Portfolio
      </Link>

      <nav className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-3">
          <span className="text-gray-500">求職者の方</span>
          <Link href="/login" className="rounded border px-3 py-1.5">
            ログイン
          </Link>
          <Link href="/register" className="rounded bg-black px-3 py-1.5 text-white">
            新規登録
          </Link>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        <div className="flex items-center gap-3">
          <span className="text-gray-500">企業の方</span>
          <Link href="/companies/login" className="rounded border px-3 py-1.5">
            企業ログイン
          </Link>
        </div>
      </nav>
    </header>
  );
}

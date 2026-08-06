import Link from "next/link";

export function Header() {
  return (
    <header className="flex w-full items-center justify-between border-b px-6 py-4">
      <Link href="/" className="font-bold text-4xl text-brand">
        Tech Match
      </Link>

      <nav className="flex items-center gap-6 text-sm">
        <Link href="/jobs" className="text-brand  font-bold text-xl transition-transform hover:-translate-y-0.5">
          求人を探す
        </Link>

        <div className="h-6 w-px bg-gray-400" />

        <div className="flex items-center gap-3">
          <span className="text-gray-700">求職者の方</span>
          <Link href="/login" className="rounded border px-3 py-1.5 font-semibold transition-transform hover:-translate-y-0.5">
            ログイン
          </Link>
          <Link
            href="/register"
            className="rounded bg-brand px-3 py-1.5 font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-sky-600"
          >
            新規登録
          </Link>
        </div>

        <div className="h-6 w-px bg-gray-400" />

        <div className="flex items-center gap-3">
          <span className="text-gray-700">企業の方</span>
          <Link
            href="/companies/login"
            className="rounded border px-3 py-1.5 font-semibold transition-transform hover:-translate-y-0.5"
          >
            企業ログイン
          </Link>
        </div>
      </nav>
    </header>
  );
}

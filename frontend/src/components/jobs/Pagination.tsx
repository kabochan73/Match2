import Link from "next/link";

export function Pagination({
  currentPage,
  lastPage,
  prevHref,
  nextHref,
}: {
  currentPage: number;
  lastPage: number;
  prevHref: string | null;
  nextHref: string | null;
}) {
  if (lastPage <= 1) return null;

  return (
    <nav className="flex items-center gap-3 text-sm">
      {prevHref ? (
        <Link href={prevHref} className="rounded border px-3 py-1.5">
          前へ
        </Link>
      ) : (
        <span className="rounded border px-3 py-1.5 text-gray-300">前へ</span>
      )}
      <span className="text-gray-500">
        {currentPage} / {lastPage}
      </span>
      {nextHref ? (
        <Link href={nextHref} className="rounded border px-3 py-1.5">
          次へ
        </Link>
      ) : (
        <span className="rounded border px-3 py-1.5 text-gray-300">次へ</span>
      )}
    </nav>
  );
}

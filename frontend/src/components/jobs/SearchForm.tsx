"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { EMPLOYMENT_TYPE_OPTIONS } from "@/lib/seeker/work-experiences/schemas";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get("keyword") ?? "");
  const [prefecture, setPrefecture] = useState(searchParams.get("prefecture") ?? "");
  const [employmentType, setEmploymentType] = useState(
    searchParams.get("employment_type") ?? "",
  );

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (prefecture) params.set("prefecture", prefecture);
    if (employmentType) params.set("employment_type", employmentType);

    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-4xl flex-wrap gap-3">
      <input
        type="text"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="キーワード(職種・内容など)"
        className="flex-1 rounded border px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-light"
      />
      <input
        type="text"
        value={prefecture}
        onChange={(event) => setPrefecture(event.target.value)}
        placeholder="都道府県(例: 東京都)"
        className="w-40 rounded border px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-light"
      />
      <select
        value={employmentType}
        onChange={(event) => setEmploymentType(event.target.value)}
        className="w-48 rounded border px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-light"
      >
        <option value="">雇用形態(すべて)</option>
        {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded bg-brand px-5 py-2 text-md font-bold text-white transition-colors hover:bg-sky-600 hover:cursor-pointer"
      >
        検索
      </button>
    </form>
  );
}

import Link from "next/link";
import { Header } from "@/components/home/Header";

const FEATURES = [
  {
    title: "プロフィールが履歴書代わりに",
    description:
      "職務経歴や資格だけでなく、実際に作った成果物へのリンクを添えてプロフィールを作成できます。",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
  {
    title: "Matchが一次審査代わりに",
    description:
      "Matchが一次審査を代わりになり、あなたと合う企業とマッチングする機会を増やすことで、無駄なマッチングを減らします。",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    ),
  },
  {
    title: "アプリ内メッセージで素早いやり取り",
    description:
      "マッチング後はアプリ内メッセージでやり取り可能。面接調整までシームレスに進められます。",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 10.5h7.5m-7.5 3h4.5m4.5-9H3.75a1.5 1.5 0 0 0-1.5 1.5v9a1.5 1.5 0 0 0 1.5 1.5H7.5v3l4.19-3H20.25a1.5 1.5 0 0 0 1.5-1.5v-9a1.5 1.5 0 0 0-1.5-1.5Z"
        />
      </svg>
    ),
  },
];

const STEPS = [
  { step: "1", title: "プロフィール登録", description: "基本情報・職務経歴・学歴・資格を登録します。" },
  { step: "2", title: "求人にいいね", description: "気になる求人を探して「いいね」を送ります。" },
  { step: "3", title: "マッチング成立", description: "いいね後７日以内に企業側からいいねをされたらマッチング成立です。" },
  { step: "4", title: "メッセージでやり取り", description: "マッチ後はアプリ内で直接面接日などをやり取りできます。" },
];

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex flex-1 flex-col items-center">
        <section className="relative flex w-full flex-col items-center overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-linear-to-b from-brand-light to-white"
          />
          <div className="flex w-full max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
            <h1 className="text-4xl font-bold">Tech Matchで、合う相手を見つけよう</h1>
            <p className="text-lg text-gray-600">
              Tech Matchは、ITエンジニア・デザイナーのための求人マッチングサービスです。
            </p>
            <div className="flex gap-4">
              <Link
                href="/register"
                className="rounded bg-brand px-6 py-3 font-bold text-white transition-colors hover:bg-sky-600"
              >
                求職者として始める
              </Link>
              <Link
                href="/companies/guide"
                className="rounded border border-brand px-6 py-3 font-bold text-brand transition-colors hover:bg-brand-light"
              >
                企業のご担当者様はこちら
              </Link>
            </div>
          </div>
        </section>

        <section className="flex w-full max-w-6xl flex-col gap-8 px-6 py-16">
          <h2 className="text-center text-2xl font-semibold">Tech Matchのいいところ</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col gap-3 rounded border p-6 transition-transform hover:-translate-y-1 shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand">
                  {feature.icon}
                </div>
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
          <h2 className="text-center text-2xl font-semibold">ご利用の流れ</h2>
          <div className="grid gap-6 sm:grid-cols-4">
            {STEPS.map((item) => (
              <div key={item.step} className="flex flex-col gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                  {item.step}
                </span>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

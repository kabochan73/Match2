import Link from "next/link";
import { Header } from "@/components/home/Header";

const FEATURES = [
  {
    title: "ポートフォリオで魅せる",
    description:
      "職務経歴や資格だけでなく、実際に作った成果物へのリンクを添えてプロフィールを作成できます。",
  },
  {
    title: "気になる求人にいいね",
    description:
      "求人一覧から興味のある企業に「いいね」を送るだけ。企業から興味を持たれればマッチング成立です。",
  },
  {
    title: "マッチしたらメッセージ",
    description:
      "マッチング後はアプリ内メッセージでやり取り可能。面接調整までシームレスに進められます。",
  },
];

const STEPS = [
  { step: "1", title: "プロフィール登録", description: "基本情報・職務経歴・学歴・資格を登録します。" },
  { step: "2", title: "求人にいいね", description: "気になる求人を探して「いいね」を送ります。" },
  { step: "3", title: "マッチング成立", description: "企業側からも興味を持たれたらマッチング成立です。" },
  { step: "4", title: "メッセージでやり取り", description: "マッチ後はアプリ内で直接やり取りできます。" },
];

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex flex-1 flex-col items-center">
        <section className="flex w-full max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
          <h1 className="text-4xl font-bold">ポートフォリオで、次の一歩を見つけよう</h1>
          <p className="text-lg text-gray-600">
            職務経歴だけでは伝わらない「作ったもの」を武器に、企業とマッチングする求人サービスです。
          </p>
          <div className="flex gap-4">
            <Link href="/register" className="rounded bg-black px-6 py-3 text-white">
              求職者として始める
            </Link>
            <Link href="/companies/guide" className="rounded border px-6 py-3">
              企業のご担当者様はこちら
            </Link>
          </div>
        </section>

        <section className="flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
          <h2 className="text-center text-2xl font-semibold">Match Portfolioでできること</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex flex-col gap-2 rounded border p-6">
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
                <span className="text-sm font-semibold text-gray-400">STEP {item.step}</span>
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

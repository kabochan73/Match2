import Link from "next/link";

const STEPS = [
  {
    step: "1",
    title: "アカウント登録",
    description: "会社名・メールアドレス・パスワードで企業アカウントを作成します。",
  },
  {
    step: "2",
    title: "企業プロフィール作成",
    description: "事業内容や働き方など、求職者に伝えたい情報を登録します。",
  },
  {
    step: "3",
    title: "求人を掲載",
    description: "募集したいポジションの求人を作成・公開します。",
  },
  {
    step: "4",
    title: "いいねをチェック",
    description: "気になる求職者に「いいね」を送るとマッチング成立です。",
  },
  {
    step: "5",
    title: "メッセージでやり取り",
    description: "マッチング後はアプリ内メッセージで直接やり取りできます。",
  },
];

export default function CompanyGuidePage() {
  return (
    <main className="flex flex-1 flex-col items-center">
      <section className="flex w-full max-w-3xl flex-col items-center gap-6 px-6 pt-20 pb-10 text-center">
        <h1 className="text-3xl font-bold">企業の方の使い方</h1>
        <p className="text-gray-600">
          Tech Matchでは、予め求職者の色々な情報を見ながらマッチングができます。
        </p>
      </section>

      <section className="flex w-full max-w-3xl flex-col gap-8 px-6 pb-20">
        <div className="flex flex-col gap-6">
          {STEPS.map((item) => (
            <div key={item.step} className="flex items-start gap-4 rounded border p-6">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                {item.step}
              </span>
              <div className="flex flex-col gap-1">
                <h2 className="font-medium">{item.title}</h2>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 pt-4">
          <Link
            href="/companies/register"
            className="rounded bg-brand px-6 py-3 font-bold text-white transition-colors hover:bg-sky-600"
          >
            新規登録に進む
          </Link>
          <Link href="/companies/login" className="text-sm text-gray-500 hover:text-brand">
            すでにアカウントをお持ちの方はこちら
          </Link>
        </div>
      </section>
    </main>
  );
}

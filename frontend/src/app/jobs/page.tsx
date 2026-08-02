import { Header } from "@/components/home/Header";
import { SearchForm } from "@/components/jobs/SearchForm";
import { JobCard } from "@/components/jobs/JobCard";
import { Pagination } from "@/components/jobs/Pagination";
import { fetchJobPostings } from "@/lib/jobs/api";

type SearchParams = {
  keyword?: string;
  prefecture?: string;
  employment_type?: string;
  page?: string;
};

function buildHref(params: SearchParams, targetPage: number): string {
  const query = new URLSearchParams();
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.prefecture) query.set("prefecture", params.prefecture);
  if (params.employment_type) query.set("employment_type", params.employment_type);
  if (targetPage > 1) query.set("page", String(targetPage));

  const qs = query.toString();
  return `/jobs${qs ? `?${qs}` : ""}`;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;

  const { data: jobPostings, meta } = await fetchJobPostings({
    keyword: params.keyword,
    prefecture: params.prefecture,
    employment_type: params.employment_type,
    page,
  });

  return (
    <>
      <Header />

      <main className="flex w-full flex-1 flex-col items-center gap-6 px-6 py-10">
        <h1 className="text-2xl font-semibold">求人を探す</h1>

        <SearchForm />

        <div className="flex w-full max-w-4xl flex-col gap-3">
          {jobPostings.length > 0 ? (
            jobPostings.map((jobPosting) => (
              <JobCard key={jobPosting.id} jobPosting={jobPosting} />
            ))
          ) : (
            <p className="text-sm text-gray-500">条件に一致する求人が見つかりませんでした</p>
          )}
        </div>

        <Pagination
          currentPage={meta.current_page}
          lastPage={meta.last_page}
          prevHref={meta.current_page > 1 ? buildHref(params, meta.current_page - 1) : null}
          nextHref={
            meta.current_page < meta.last_page ? buildHref(params, meta.current_page + 1) : null
          }
        />
      </main>
    </>
  );
}

import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Called by the Laravel backend after a job posting is created, updated,
// published, closed, or deleted, so /jobs and /jobs/[id] stay in sync
// without relying on a fixed time-based revalidate window.
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const jobPostingId = body?.job_posting_id;
  if (!jobPostingId) {
    return NextResponse.json({ message: "job_posting_id is required" }, { status: 400 });
  }

  // { expire: 0 } expires the tag immediately, rather than the "max"
  // stale-while-revalidate profile: a webhook call means the source of
  // truth already changed, so the next visit should never serve stale data.
  revalidateTag("job-postings", { expire: 0 });
  revalidateTag(`job-posting-${jobPostingId}`, { expire: 0 });

  return NextResponse.json({ revalidated: true });
}

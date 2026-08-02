import "server-only";
import { cookies } from "next/headers";
import { INTERNAL_API_URL, SITE_URL } from "./config";
import { ApiError } from "./errors";

/**
 * Server Component fetch wrapper: forwards the incoming request's
 * cookies (Sanctum session cookie) so authenticated SSR reads work.
 * GET-only by convention — mutations always go through apiClientFetch
 * from the browser (see the hybrid SSR/CSR auth design).
 */
export async function apiServerFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  headers.set("Origin", SITE_URL);
  if (cookieHeader) {
    headers.set("Cookie", cookieHeader);
  }

  const response = await fetch(`${INTERNAL_API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body);
  }

  return (await response.json()) as T;
}

/**
 * Server Component fetch wrapper for public, unauthenticated endpoints
 * (e.g. job postings). Unlike apiServerFetch, this never calls cookies(),
 * so the caller's `cache`/`next` options (e.g. `next: { revalidate: 600 }`)
 * are respected, enabling the Next.js Data Cache for these requests.
 */
export async function apiPublicFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  const response = await fetch(`${INTERNAL_API_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body);
  }

  return (await response.json()) as T;
}

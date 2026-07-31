import { PUBLIC_API_URL } from "./config";
import { ApiError } from "./errors";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function readCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

async function ensureCsrfCookie(): Promise<void> {
  await fetch(`${PUBLIC_API_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
}

/**
 * Browser-side fetch wrapper for Laravel Sanctum SPA auth: sends the
 * session cookie automatically and attaches the X-XSRF-TOKEN header
 * (fetching /sanctum/csrf-cookie first if it isn't set yet) for
 * mutating requests.
 */
export async function apiClientFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const method = (init.method ?? "GET").toUpperCase();

  if (MUTATING_METHODS.has(method) && !readCookie("XSRF-TOKEN")) {
    await ensureCsrfCookie();
  }

  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (MUTATING_METHODS.has(method)) {
    const token = readCookie("XSRF-TOKEN");
    if (token) headers.set("X-XSRF-TOKEN", token);
  }

  const response = await fetch(`${PUBLIC_API_URL}${path}`, {
    ...init,
    method,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

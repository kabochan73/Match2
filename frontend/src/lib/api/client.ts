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

function sendRequest(
  path: string,
  method: string,
  isMutating: boolean,
  init: RequestInit,
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (isMutating) {
    const token = readCookie("XSRF-TOKEN");
    if (token) headers.set("X-XSRF-TOKEN", token);
  }

  return fetch(`${PUBLIC_API_URL}${path}`, {
    ...init,
    method,
    headers,
    credentials: "include",
  });
}

async function toResult<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(response.status, body);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
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
  const isMutating = MUTATING_METHODS.has(method);

  if (isMutating && !readCookie("XSRF-TOKEN")) {
    await ensureCsrfCookie();
  }

  const response = await sendRequest(path, method, isMutating, init);

  // A present XSRF-TOKEN cookie isn't necessarily a *valid* one (e.g. the
  // session it was issued for expired). On a 419 (CSRF mismatch), refresh
  // the CSRF cookie once and retry, instead of failing every request from
  // then on until the user manually clears cookies.
  if (response.status === 419 && isMutating) {
    await ensureCsrfCookie();
    return toResult<T>(await sendRequest(path, method, isMutating, init));
  }

  return toResult<T>(response);
}

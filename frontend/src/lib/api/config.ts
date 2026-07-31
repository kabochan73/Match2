export const PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const INTERNAL_API_URL = process.env.API_INTERNAL_URL ?? PUBLIC_API_URL;

// Must match a SANCTUM_STATEFUL_DOMAINS entry on the backend: Sanctum's
// EnsureFrontendRequestsAreStateful middleware only attaches session-based
// auth to requests whose Origin/Referer looks like the SPA's own origin.
// Server-side fetches (no real browser Origin) need to send this explicitly.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

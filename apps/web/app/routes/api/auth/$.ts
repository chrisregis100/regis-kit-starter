/**
 * Better Auth catch-all route handler.
 *
 * All requests to /api/auth/* are forwarded to the Better Auth handler.
 * Better Auth handles: sign-in, sign-up, sign-out, sessions, OAuth callbacks,
 * password reset, organization management, etc.
 */
import { createAPIFileRoute } from "@tanstack/start/api";
import { auth } from "@rk-kit/auth";

export const APIRoute = createAPIFileRoute("/api/auth/$")({
  GET: ({ request }) => auth.handler(request),
  POST: ({ request }) => auth.handler(request),
});

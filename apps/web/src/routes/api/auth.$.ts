/**
 * Better Auth catch-all API handler.
 * Handles all /api/auth/* requests (sign-in, sign-up, sessions, OAuth, etc.)
 * SERVER-ONLY — Vinxi/TanStack Start routes this to the Node.js server.
 */
import { createAPIFileRoute } from "@tanstack/start/api";
import { auth } from "@rk-kit/auth";

export const APIRoute = createAPIFileRoute("/api/auth/$")({
  GET: ({ request }) => auth.handler(request),
  POST: ({ request }) => auth.handler(request),
});

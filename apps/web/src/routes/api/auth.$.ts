/**
 * Better Auth catch-all API handler.
 * Handles all /api/auth/* requests (sign-in, sign-up, sessions, OAuth,
 * organization management, …). SERVER-ONLY — handlers never ship to the client.
 */
import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@rk-kit/auth";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => auth.handler(request),
      POST: ({ request }) => auth.handler(request),
    },
  },
});

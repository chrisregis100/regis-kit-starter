/**
 * Server-only session helpers via createServerFn.
 *
 * These run on the server (during SSR or via fetch when navigating client-side)
 * and use @rk-kit/auth helpers to read/require the session from the H3 event.
 *
 * Used in route `beforeLoad` callbacks and loaders for auth protection.
 */
import { createServerFn } from "@tanstack/start";
import { getWebRequest } from "@tanstack/start/server";
import {
  getSession,
  requireSession,
  requireOrganization,
} from "@rk-kit/auth";

/**
 * Returns the current session or null. Safe for public routes.
 */
export const getServerSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getWebRequest();
    return getSession(request.headers);
  },
);

/**
 * Returns the session or throws UnauthorizedError (401).
 * Use in protected route beforeLoad.
 */
export const requireServerSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getWebRequest();
    return requireSession(request.headers);
  },
);

/**
 * Returns session + organizationId or throws UnauthorizedError / ForbiddenError.
 * Use in org-scoped routes (dashboard).
 */
export const requireServerOrganization = createServerFn({
  method: "GET",
}).handler(async () => {
  const request = getWebRequest();
  return requireOrganization(request.headers);
});

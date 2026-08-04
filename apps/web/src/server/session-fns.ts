/**
 * Server-only session helpers exposed as TanStack Start server functions.
 *
 * They run on the server (during SSR, or via RPC when navigating client-side)
 * and wrap the @rk-kit/auth helpers. Route `beforeLoad` callbacks use them to
 * protect routes: redirects thrown here are serialized to the client and
 * re-thrown by the router.
 */
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";
import { getSession } from "@rk-kit/auth";

/** Current session or null. Safe for public routes. */
export const getServerSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequest();
    return getSession(request.headers);
  },
);

/**
 * Auth + organization guard for protected routes.
 *   - not authenticated       → redirect to /login
 *   - no active organization  → redirect to /onboarding
 */
export const getProtectedContext = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequest();
    const authSession = await getSession(request.headers);

    if (!authSession) throw redirect({ to: "/login" });

    const organizationId = authSession.session.activeOrganizationId;
    if (!organizationId) throw redirect({ to: "/onboarding" });

    return {
      session: authSession.session,
      user: authSession.user,
      organizationId,
    };
  },
);

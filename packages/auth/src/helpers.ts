/**
 * Server-side auth helpers for TanStack Start route loaders / server functions.
 *
 * Usage pattern:
 * ```ts
 * // Public route — session may or may not exist
 * const session = await getSession(request.headers);
 *
 * // Protected route — throws UnauthorizedError if not authenticated
 * const { user, session } = await requireSession(request.headers);
 *
 * // Org-scoped route — throws ForbiddenError if no active organisation
 * const { user, session, organizationId } = await requireOrganization(request.headers);
 * // Then use: withTenant(organizationId, async (db) => { … })
 * ```
 */
import { ForbiddenError, UnauthorizedError } from "@rk-kit/errors";
import { auth } from "./config.js";
import type { AuthSession } from "./types.js";

/**
 * Returns the current session+user pair, or null if no valid session exists.
 * Does NOT throw — use `requireSession` for protected routes.
 */
export async function getSession(headers: Headers): Promise<AuthSession | null> {
  const result = await auth.api.getSession({ headers });
  if (!result) return null;

  // Normalise to our stable AuthSession shape.
  return {
    session: {
      id: result.session.id,
      userId: result.session.userId,
      token: result.session.token,
      expiresAt: result.session.expiresAt,
      ipAddress: result.session.ipAddress ?? null,
      userAgent: result.session.userAgent ?? null,
      activeOrganizationId:
        (result.session as { activeOrganizationId?: string | null }).activeOrganizationId ?? null,
      createdAt: result.session.createdAt,
      updatedAt: result.session.updatedAt,
    },
    user: {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      emailVerified: result.user.emailVerified,
      image: result.user.image ?? null,
      createdAt: result.user.createdAt,
      updatedAt: result.user.updatedAt,
    },
  };
}

/**
 * Returns session+user or throws UnauthorizedError (401).
 * Use in every protected loader/server-function.
 */
export async function requireSession(headers: Headers): Promise<AuthSession> {
  const authSession = await getSession(headers);
  if (!authSession) {
    throw new UnauthorizedError("Authentication is required to access this resource.");
  }
  return authSession;
}

/**
 * Ensures the user is authenticated AND has an active organisation.
 * Throws:
 *   - UnauthorizedError (401) if not authenticated
 *   - ForbiddenError (403) if no active organisation is set
 *
 * Returns session, user, and the resolved organizationId to pass to withTenant().
 */
export async function requireOrganization(headers: Headers): Promise<{
  session: AuthSession["session"];
  user: AuthSession["user"];
  organizationId: string;
}> {
  const { session, user } = await requireSession(headers);

  const organizationId = session.activeOrganizationId;
  if (!organizationId) {
    throw new ForbiddenError(
      "An active organisation is required. Please select or create one.",
    );
  }

  return { session, user, organizationId };
}

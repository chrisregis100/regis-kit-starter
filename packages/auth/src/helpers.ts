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
 * // Org-scoped route — throws ForbiddenError if no organisation membership
 * const { user, session, organizationId } = await requireOrganization(request.headers);
 * // Then use: withTenant(organizationId, async (db) => { … })
 * ```
 */
import { serverEnv } from "@rk-kit/config";
import { ForbiddenError, UnauthorizedError } from "@rk-kit/errors";
import {
  asc,
  eq,
  getDb,
  member,
  organization,
  session as sessionTable,
  sql,
  user,
} from "@rk-kit/db";
import { auth } from "./config.js";
import type { AuthSession } from "./types.js";

export interface UserOrganization {
  id: string;
  name: string;
  slug: string | null;
  logo: string | null;
  createdAt: Date;
}

export type PostAuthDestination =
  | {
      kind: "dashboard";
      organizationId: string;
      session: AuthSession["session"];
      user: AuthSession["user"];
    }
  | {
      kind: "select";
      organizations: UserOrganization[];
      session: AuthSession["session"];
      user: AuthSession["user"];
    }
  | {
      kind: "onboarding";
      session: AuthSession["session"];
      user: AuthSession["user"];
    };

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
 * Whether the given user is the platform super-admin.
 *
 * The admin is designated by the ADMIN_EMAIL environment variable. The check is
 * case-insensitive and returns false when ADMIN_EMAIL is unset, so the admin
 * surface stays disabled by default.
 */
export function isAdmin(userEmail: string): boolean {
  const adminEmail = serverEnv.ADMIN_EMAIL;
  if (!adminEmail) return false;
  return userEmail.trim().toLowerCase() === adminEmail.trim().toLowerCase();
}

/**
 * Returns the authenticated admin session, or throws.
 *   - not authenticated → UnauthorizedError (401)
 *   - authenticated but not the platform admin → ForbiddenError (403)
 */
export async function requireAdmin(headers: Headers): Promise<AuthSession> {
  const authSession = await requireSession(headers);
  if (!isAdmin(authSession.user.email)) {
    throw new ForbiddenError("Platform administrator access is required.");
  }
  return authSession;
}

/**
 * Whether an account exists for the given email (case-insensitive).
 *
 * SECURITY NOTE: exposing this result to clients enables user enumeration.
 * Use it only where that trade-off is intentional (e.g. explicit
 * "email not found" feedback on the forgot-password form).
 */
export async function userExistsByEmail(email: string): Promise<boolean> {
  const db = getDb();
  const normalized = email.trim().toLowerCase();

  const rows = await db
    .select({ id: user.id })
    .from(user)
    .where(sql`lower(${user.email}) = ${normalized}`)
    .limit(1);

  return rows.length > 0;
}

/** Organisations the user belongs to, ordered by creation date. */
export async function listUserOrganizations(
  userId: string,
): Promise<UserOrganization[]> {
  const db = getDb();

  return db
    .select({
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      logo: organization.logo,
      createdAt: organization.createdAt,
    })
    .from(member)
    .innerJoin(organization, eq(member.organizationId, organization.id))
    .where(eq(member.userId, userId))
    .orderBy(asc(organization.createdAt));
}

/** Persist the active organisation on the session row (DB). */
export async function setSessionActiveOrganization(
  sessionToken: string,
  organizationId: string,
): Promise<void> {
  const db = getDb();

  await db
    .update(sessionTable)
    .set({
      activeOrganizationId: organizationId,
      updatedAt: new Date(),
    })
    .where(eq(sessionTable.token, sessionToken));
}

/**
 * Post-login / post-auth routing decision based on organisation memberships:
 *   - 0 orgs  → onboarding (create / join)
 *   - 1 org   → activate it and go to dashboard
 *   - N orgs  → org picker (unless a valid active org is already on the session)
 */
export async function resolvePostAuthDestination(
  headers: Headers,
  authSession?: AuthSession,
): Promise<PostAuthDestination | null> {
  const resolved = authSession ?? (await getSession(headers));
  if (!resolved) return null;

  const organizations = await listUserOrganizations(resolved.user.id);

  if (organizations.length === 0) {
    return {
      kind: "onboarding",
      session: resolved.session,
      user: resolved.user,
    };
  }

  const activeOrganizationId = resolved.session.activeOrganizationId;
  const hasValidActive =
    !!activeOrganizationId &&
    organizations.some((org) => org.id === activeOrganizationId);

  if (hasValidActive && activeOrganizationId) {
    return {
      kind: "dashboard",
      organizationId: activeOrganizationId,
      session: resolved.session,
      user: resolved.user,
    };
  }

  if (organizations.length === 1) {
    const organizationId = organizations[0]!.id;
    await setSessionActiveOrganization(resolved.session.token, organizationId);

    return {
      kind: "dashboard",
      organizationId,
      session: { ...resolved.session, activeOrganizationId: organizationId },
      user: resolved.user,
    };
  }

  return {
    kind: "select",
    organizations,
    session: resolved.session,
    user: resolved.user,
  };
}

/**
 * Ensures the user is authenticated AND has an active organisation.
 *
 * If the session has no active org but the user has exactly one membership,
 * that org is activated automatically. Multiple memberships without an active
 * org require an explicit choice (ForbiddenError).
 */
export async function requireOrganization(headers: Headers): Promise<{
  session: AuthSession["session"];
  user: AuthSession["user"];
  organizationId: string;
}> {
  const authSession = await requireSession(headers);
  const destination = await resolvePostAuthDestination(headers, authSession);

  if (!destination || destination.kind === "onboarding") {
    throw new ForbiddenError(
      "An active organisation is required. Please select or create one.",
    );
  }

  if (destination.kind === "select") {
    throw new ForbiddenError(
      "Please select an organisation before continuing.",
    );
  }

  return {
    session: destination.session,
    user: destination.user,
    organizationId: destination.organizationId,
  };
}

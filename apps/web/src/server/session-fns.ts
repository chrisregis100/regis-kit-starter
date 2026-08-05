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
import {
  getSession,
  isAdmin,
  listUserOrganizations,
  resolvePostAuthDestination,
  setSessionActiveOrganization,
} from "@rk-kit/auth";
import { z } from "zod";

/** Current session or null. Safe for public routes. */
export const getServerSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequest();
    return getSession(request.headers);
  },
);

/**
 * Auth + organization guard for protected dashboard routes.
 *   - not authenticated                         → /login
 *   - no organisation memberships               → /onboarding
 *   - multiple orgs, none active                → /select-organization
 *   - one org (or a valid active org already)   → continue
 */
export const getProtectedContext = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequest();
    const destination = await resolvePostAuthDestination(request.headers);

    if (!destination) throw redirect({ to: "/login" });
    if (destination.kind === "onboarding") {
      throw redirect({ to: "/onboarding" });
    }
    if (destination.kind === "select") {
      throw redirect({ to: "/select-organization" });
    }

    return {
      session: destination.session,
      user: destination.user,
      organizationId: destination.organizationId,
      isAdmin: isAdmin(destination.user.email),
    };
  },
);

/**
 * Post-auth landing: decides between dashboard, org picker, or onboarding.
 * Used by `/select-organization` after login/signup.
 */
export const getSelectOrganizationContext = createServerFn({
  method: "GET",
}).handler(async () => {
  const request = getRequest();
  const destination = await resolvePostAuthDestination(request.headers);

  if (!destination) throw redirect({ to: "/login" });
  if (destination.kind === "onboarding") {
    throw redirect({ to: "/onboarding" });
  }
  if (destination.kind === "dashboard") {
    throw redirect({ to: "/dashboard" });
  }

  return {
    session: destination.session,
    user: destination.user,
    organizations: destination.organizations,
  };
});

/**
 * Gate for the onboarding route — only users with zero memberships stay here.
 */
export const getOnboardingContext = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequest();
    const destination = await resolvePostAuthDestination(request.headers);

    if (!destination) throw redirect({ to: "/login" });
    if (destination.kind === "dashboard") {
      throw redirect({ to: "/dashboard" });
    }
    if (destination.kind === "select") {
      throw redirect({ to: "/select-organization" });
    }

    return {
      session: destination.session,
      user: destination.user,
    };
  },
);

const selectOrganizationInput = z.object({
  organizationId: z.string().min(1),
});

/** Activate a chosen organisation on the current session, then go to dashboard. */
export const selectOrganizationFn = createServerFn({ method: "POST" })
  .validator(selectOrganizationInput)
  .handler(async (ctx) => {
    const request = getRequest();
    const authSession = await getSession(request.headers);

    if (!authSession) throw redirect({ to: "/login" });

    const organizations = await listUserOrganizations(authSession.user.id);
    if (organizations.length === 0) throw redirect({ to: "/onboarding" });

    const isMember = organizations.some(
      (org) => org.id === ctx.data.organizationId,
    );
    if (!isMember) {
      throw new Error("You are not a member of this organisation.");
    }

    await setSessionActiveOrganization(
      authSession.session.token,
      ctx.data.organizationId,
    );

    return { success: true as const, organizationId: ctx.data.organizationId };
  });

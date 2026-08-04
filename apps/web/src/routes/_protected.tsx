import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start-client-core";
import { getRequest } from "@tanstack/start/server";
import { requireOrganization, getSession } from "@rk-kit/auth";
import type { AuthSession } from "@rk-kit/auth";
import { DashboardShell } from "../components/dashboard/DashboardShell";

/**
 * Server function: verify the caller is authenticated AND has an active org.
 * Throws a redirect to /login if not — TanStack Router catches it.
 */
const getProtectedContext = createServerFn().handler(async (): Promise<{
  session: AuthSession["session"];
  user: AuthSession["user"];
  organizationId: string;
}> => {
  const request = getRequest();

  try {
    return await requireOrganization(request.headers);
  } catch {
    const authSession = await getSession(request.headers);
    if (!authSession) {
      throw redirect({ to: "/login" });
    }
    // Authenticated but no active org → redirect to login for now
    throw redirect({ to: "/login" });
  }
});

export const Route = createFileRoute("/_protected")({
  beforeLoad: async () => {
    const ctx = await getProtectedContext();
    return ctx;
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  const ctx = Route.useRouteContext();
  return (
    <DashboardShell user={ctx.user} organizationId={ctx.organizationId}>
      <Outlet />
    </DashboardShell>
  );
}

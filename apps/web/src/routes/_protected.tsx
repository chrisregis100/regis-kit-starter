import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell } from "../components/dashboard/DashboardShell";
import { getProtectedContext } from "../server/session-fns";

/**
 * Pathless layout guarding every dashboard route.
 *
 * The guard runs on the server (server function):
 *   - unauthenticated → /login
 *   - no orgs → /onboarding
 *   - multiple orgs without an active one → /select-organization
 * The resolved { session, user, organizationId } is exposed as router context.
 */
export const Route = createFileRoute("/_protected")({
  beforeLoad: async () => getProtectedContext(),
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

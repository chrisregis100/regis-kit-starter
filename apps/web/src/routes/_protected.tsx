import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardShell } from "../components/dashboard/DashboardShell";
import { getProtectedContext } from "../lib/session-fns";

/**
 * Pathless layout guarding every dashboard route.
 *
 * The guard runs on the server (server function): unauthenticated users are
 * redirected to /login, authenticated users without an active organization
 * to /onboarding. The resolved { session, user, organizationId } is exposed
 * as router context to all child routes.
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

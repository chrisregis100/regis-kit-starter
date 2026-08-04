/**
 * Pathless layout protecting all /dashboard/* routes.
 *
 * Runs `requireServerOrganization` on every navigation — if the user
 * is unauthenticated or has no active org they are redirected.
 */
import {
  createFileRoute,
  redirect,
  Outlet,
} from "@tanstack/react-router";
import { requireServerOrganization } from "../lib/session.server";
import { DashboardShell } from "../components/dashboard/DashboardShell";

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: async () => {
    try {
      return await requireServerOrganization();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: () => (
    <DashboardShell>
      <Outlet />
    </DashboardShell>
  ),
});

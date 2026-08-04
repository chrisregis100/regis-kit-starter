/**
 * Pathless layout for authentication pages (/login, /signup, etc.).
 *
 * Redirects already-authenticated users to /dashboard.
 * Provides the centered card layout used by all auth pages.
 */
import {
  createFileRoute,
  redirect,
  Outlet,
  Link,
} from "@tanstack/react-router";
import { getServerSession } from "../lib/session.server";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async () => {
    const session = await getServerSession();
    if (session) {
      if (session.session.activeOrganizationId) {
        throw redirect({ to: "/dashboard" });
      }
      throw redirect({ to: "/onboarding" });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4">
      {/* Logo */}
      <Link to="/" className="mb-8 flex items-center gap-2 font-bold text-zinc-900">
        <div
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white"
        >
          R
        </div>
        RegisKit
      </Link>

      <Outlet />
    </div>
  );
}

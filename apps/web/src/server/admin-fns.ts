/**
 * Admin server functions — the front (TanStack Start) boundary.
 *
 * Every function is gated by requireAdmin(), which throws ForbiddenError (403)
 * for any signed-in user who is not the platform admin (ADMIN_EMAIL). The
 * business logic lives in the admin service and runs across all organizations.
 */
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireAdmin } from "@rk-kit/auth";
import { getAdminDashboardData } from "../services/admin-service";

export const getAdminDashboardFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequest();
    await requireAdmin(request.headers);
    return getAdminDashboardData();
  },
);

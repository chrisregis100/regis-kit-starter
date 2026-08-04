/**
 * Team server functions — the front (TanStack Start) boundary.
 *
 * Validation/authorization mirror the project functions: resolve the tenant
 * from the session, then delegate to the team service (Better Auth org API).
 */
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireOrganization } from "@rk-kit/auth";
import {
  getTeam,
  inviteMember,
  inviteMemberSchema,
  removeMember,
  removeMemberSchema,
} from "../services/team-service";

export const getTeamData = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequest();
    const { organizationId } = await requireOrganization(request.headers);
    const team = await getTeam(organizationId, request.headers);
    return { organizationId, ...team };
  },
);

export const inviteMemberFn = createServerFn({ method: "POST" })
  .validator(inviteMemberSchema)
  .handler(async (ctx) => {
    const request = getRequest();
    const { organizationId } = await requireOrganization(request.headers);
    await inviteMember(organizationId, request.headers, ctx.data);
    return { success: true };
  });

export const removeMemberFn = createServerFn({ method: "POST" })
  .validator(removeMemberSchema)
  .handler(async (ctx) => {
    const request = getRequest();
    const { organizationId } = await requireOrganization(request.headers);
    await removeMember(organizationId, request.headers, ctx.data);
    return { success: true };
  });

/**
 * Team management service — server-only.
 *
 * Uses the Better Auth API (via auth.api) to manage organization members
 * and invitations. Better Auth handles its own table-level security.
 */
import { createServerFn } from "@tanstack/start";
import { getWebRequest } from "@tanstack/start/server";
import { z } from "zod";
import { auth, requireOrganization } from "@rk-kit/auth";

const InviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["member", "admin"]).default("member"),
});

const RemoveMemberSchema = z.object({
  memberId: z.string().min(1),
});

/**
 * List members + pending invitations for the active organization.
 */
export const listTeam = createServerFn({ method: "GET" }).handler(async () => {
  const request = getWebRequest();
  const { organizationId } = await requireOrganization(request.headers);

  const org = await auth.api.getFullOrganization({
    headers: request.headers,
    query: { organizationId },
  });

  return { members: org?.members ?? [], invitations: org?.invitations ?? [] };
});

/**
 * Invite a new member to the active organization.
 */
export const inviteMember = createServerFn({ method: "POST" })
  .validator(InviteMemberSchema)
  .handler(async ({ data }) => {
    const request = getWebRequest();
    const { organizationId } = await requireOrganization(request.headers);

    return auth.api.createInvitation({
      headers: request.headers,
      body: {
        organizationId,
        email: data.email,
        role: data.role,
      },
    });
  });

/**
 * Remove a member from the active organization.
 */
export const removeMember = createServerFn({ method: "POST" })
  .validator(RemoveMemberSchema)
  .handler(async ({ data }) => {
    const request = getWebRequest();
    const { organizationId } = await requireOrganization(request.headers);

    return auth.api.removeMember({
      headers: request.headers,
      body: {
        organizationId,
        memberIdOrEmail: data.memberId,
      },
    });
  });

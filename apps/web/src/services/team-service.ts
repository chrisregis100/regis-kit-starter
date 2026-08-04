/**
 * Team service — organization members and invitations, server-only.
 *
 * Uses the Better Auth server API (auth.api). Better Auth performs its own
 * permission checks (only org admins/owners can invite or remove), so these
 * functions only add input validation on top.
 */
import { z } from "zod";
import { ValidationError } from "@rk-kit/errors";
import { auth } from "@rk-kit/auth";

export const inviteMemberSchema = z.object({
  email: z.string().email("Must be a valid email address"),
  role: z.enum(["member", "admin"]),
});

export const removeMemberSchema = z.object({
  memberId: z.string().min(1, "Member id is required"),
});

/** Enriched member shape returned by Better Auth's getFullOrganization. */
export interface OrgMember {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: Date;
  user?: { name: string; email: string; image?: string | null } | null;
}

/** Invitation shape returned by Better Auth's getFullOrganization. */
export interface OrgInvitation {
  id: string;
  organizationId: string;
  email: string;
  role: string;
  status: string;
  expiresAt: Date;
  inviterId: string;
}

export interface TeamData {
  members: OrgMember[];
  invitations: OrgInvitation[];
}

export async function getTeam(
  organizationId: string,
  headers: Headers,
): Promise<TeamData> {
  const org = await auth.api.getFullOrganization({
    query: { organizationId },
    headers,
  });

  return {
    members: (org?.members ?? []) as OrgMember[],
    invitations: (org?.invitations ?? []) as OrgInvitation[],
  };
}

export async function inviteMember(
  organizationId: string,
  headers: Headers,
  input: unknown,
): Promise<void> {
  const parsed = inviteMemberSchema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues.map((i) => i.message).join(", "),
    );
  }

  await auth.api.createInvitation({
    body: {
      organizationId,
      email: parsed.data.email,
      role: parsed.data.role,
    },
    headers,
  });
}

export async function removeMember(
  organizationId: string,
  headers: Headers,
  input: unknown,
): Promise<void> {
  const parsed = removeMemberSchema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues.map((i) => i.message).join(", "),
    );
  }

  await auth.api.removeMember({
    body: { organizationId, memberIdOrEmail: parsed.data.memberId },
    headers,
  });
}

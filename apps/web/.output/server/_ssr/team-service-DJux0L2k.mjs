import { V as ValidationError } from "./errors--trM2I6Z.mjs";
import { a as auth } from "./index-0g789sOm.mjs";
import { o as object, _ as _enum, s as string } from "../_libs/zod.mjs";
const inviteMemberSchema = object({
  email: string().email("Must be a valid email address"),
  role: _enum(["member", "admin"])
});
const removeMemberSchema = object({
  memberId: string().min(1, "Member id is required")
});
async function getTeam(organizationId, headers) {
  const org = await auth.api.getFullOrganization({
    query: { organizationId },
    headers
  });
  return {
    members: org?.members ?? [],
    invitations: org?.invitations ?? []
  };
}
async function inviteMember(organizationId, headers, input) {
  const parsed = inviteMemberSchema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues.map((i) => i.message).join(", ")
    );
  }
  await auth.api.createInvitation({
    body: {
      organizationId,
      email: parsed.data.email,
      role: parsed.data.role
    },
    headers
  });
}
async function removeMember(organizationId, headers, input) {
  const parsed = removeMemberSchema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError(
      parsed.error.issues.map((i) => i.message).join(", ")
    );
  }
  await auth.api.removeMember({
    body: { organizationId, memberIdOrEmail: parsed.data.memberId },
    headers
  });
}
export {
  inviteMember as a,
  removeMember as b,
  getTeam as g,
  inviteMemberSchema as i,
  removeMemberSchema as r
};

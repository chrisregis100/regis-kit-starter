import { T as TSS_SERVER_FUNCTION } from "./index.mjs";
import { F as ForbiddenError, U as UnauthorizedError } from "./errors--trM2I6Z.mjs";
import { a as auth } from "./index-0g789sOm.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
async function getSession(headers) {
  const result = await auth.api.getSession({ headers });
  if (!result)
    return null;
  return {
    session: {
      id: result.session.id,
      userId: result.session.userId,
      token: result.session.token,
      expiresAt: result.session.expiresAt,
      ipAddress: result.session.ipAddress ?? null,
      userAgent: result.session.userAgent ?? null,
      activeOrganizationId: result.session.activeOrganizationId ?? null,
      createdAt: result.session.createdAt,
      updatedAt: result.session.updatedAt
    },
    user: {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      emailVerified: result.user.emailVerified,
      image: result.user.image ?? null,
      createdAt: result.user.createdAt,
      updatedAt: result.user.updatedAt
    }
  };
}
async function requireSession(headers) {
  const authSession = await getSession(headers);
  if (!authSession) {
    throw new UnauthorizedError("Authentication is required to access this resource.");
  }
  return authSession;
}
async function requireOrganization(headers) {
  const { session, user } = await requireSession(headers);
  const organizationId = session.activeOrganizationId;
  if (!organizationId) {
    throw new ForbiddenError("An active organisation is required. Please select or create one.");
  }
  return { session, user, organizationId };
}
export {
  createServerRpc as c,
  getSession as g,
  requireOrganization as r
};

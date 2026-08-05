/**
 * @rk-kit/auth
 *
 * Better Auth server-side configuration + session helpers.
 * SERVER-ONLY — never import in client bundles.
 *
 * Exports:
 *   auth                 — Better Auth instance (handler, api)
 *   getSession(headers)  — returns AuthSession | null
 *   requireSession(h)    — returns AuthSession or throws 401
 *   listUserOrganizations(userId)
 *   resolvePostAuthDestination(h) — 0/1/N org routing decision
 *   requireOrganization(h) — returns { session, user, organizationId } or throws 401/403
 *
 * Types:
 *   AuthSession, SessionUser, SessionRecord, UserOrganization, PostAuthDestination
 */
export { auth, enabledOAuthProviders, oauthProviderStatuses } from "./config.js";
export {
  getEnabledOAuthProviders,
  getOAuthProviderStatuses,
  OAUTH_PROVIDER_IDS,
  type OAuthProviderId,
  type OAuthProviderStatus,
} from "./social-providers.js";
export {
  getSession,
  requireSession,
  listUserOrganizations,
  setSessionActiveOrganization,
  resolvePostAuthDestination,
  requireOrganization,
} from "./helpers.js";
export type {
  AuthSession,
  SessionUser,
  SessionRecord,
} from "./types.js";
export type { UserOrganization, PostAuthDestination } from "./helpers.js";

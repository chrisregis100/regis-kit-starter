/**
 * Better Auth client for use in browser/client components.
 *
 * Provides:
 *   authClient.signIn.email / signUp.email / signOut
 *   authClient.organization.*  (create, list, setActive, inviteMember, removeMember)
 *   authClient.useSession()    — reactive session hook
 *   authClient.forgetPassword / resetPassword
 *
 * Never import @rk-kit/auth server helpers from here.
 */
import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [organizationClient()],
});

export type Session = typeof authClient.$Infer.Session;

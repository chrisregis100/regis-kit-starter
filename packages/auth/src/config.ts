/**
 * Better Auth server-side configuration.
 *
 * SERVER-ONLY — never import in client bundles.
 *
 * Reads validated environment variables from @rk-kit/config (fail-fast at startup).
 * Uses the shared Drizzle pool from @rk-kit/db so Better Auth shares the same
 * connection pool as application code.
 */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { serverEnv } from "@rk-kit/config";
import {
  getDb,
  user,
  session,
  account,
  verification,
  organization as organizationTable,
  member,
  invitation,
} from "@rk-kit/db";

export const auth = betterAuth({
  secret: serverEnv.BETTER_AUTH_SECRET,
  baseURL: serverEnv.BETTER_AUTH_URL,

  database: drizzleAdapter(getDb(), {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
      organization: organizationTable,
      member,
      invitation,
    },
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    /**
     * TODO (Phase 3): send a real email via @rk-kit/email (not yet implemented).
     * For now, log the URL so dev flow works without an SMTP server.
     */
    sendResetPassword: async ({ user: u, url }: { user: { email: string }; url: string; token: string }) => {
      console.log(`[auth] Reset password URL for ${u.email}: ${url}`);
    },
  },

  socialProviders:
    serverEnv.GOOGLE_CLIENT_ID && serverEnv.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: serverEnv.GOOGLE_CLIENT_ID,
            clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
          },
        }
      : {},

  plugins: [
    organization({
      /**
       * Allow each user to create organisations.
       * A user can belong to multiple organisations; the active one is stored
       * in session.activeOrganizationId and picked up by withTenant().
       */
      allowUserToCreateOrganization: true,
    }),
  ],
});

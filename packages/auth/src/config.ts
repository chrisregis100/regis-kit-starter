/**
 * Better Auth server-side configuration.
 *
 * SERVER-ONLY — never import in client bundles.
 */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { serverEnv } from "@rk-kit/config";
import {
  sendPasswordResetEmail,
  sendInvitationEmail,
  sendVerificationEmail,
} from "@rk-kit/email";
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
import {
  buildSocialProviders,
  buildTrustedOrigins,
  getEnabledOAuthProviders,
  getOAuthProviderStatuses,
} from "./social-providers.js";

export const enabledOAuthProviders = getEnabledOAuthProviders(serverEnv);
export const oauthProviderStatuses = getOAuthProviderStatuses(serverEnv);

export const auth = betterAuth({
  secret: serverEnv.BETTER_AUTH_SECRET,
  baseURL: serverEnv.BETTER_AUTH_URL,
  trustedOrigins: buildTrustedOrigins(serverEnv),

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
    sendResetPassword: async ({ user: u, url }: { user: { email: string }; url: string; token: string }) => {
      await sendPasswordResetEmail({ to: u.email, url });
    },
  },

  emailVerification: {
    sendOnSignUp: false,
    sendVerificationEmail: async ({ user: u, url }: { user: { email: string }; url: string; token: string }) => {
      await sendVerificationEmail({ to: u.email, url });
    },
  },

  socialProviders: buildSocialProviders(serverEnv),

  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      sendInvitationEmail: async (data) => {
        const url = `${serverEnv.BETTER_AUTH_URL}/onboarding?invitation=${data.id}`;
        await sendInvitationEmail({
          to: data.email,
          url,
          organizationName: data.organization.name,
          inviterName: data.inviter.user.name,
        });
      },
    }),
  ],
});

/**
 * OAuth provider wiring for Better Auth.
 *
 * Providers are enabled only when their credentials are present in serverEnv.
 * Missing credentials are silently skipped — no startup failure.
 */
import { importPKCS8, SignJWT } from "jose";
import type { ServerEnv } from "@rk-kit/config";
import type { BetterAuthOptions } from "better-auth";

export const OAUTH_PROVIDER_IDS = [
  "google",
  "github",
  "facebook",
  "apple",
  "microsoft",
  "discord",
  "linkedin",
] as const;

export type OAuthProviderId = (typeof OAUTH_PROVIDER_IDS)[number];

type SocialProvidersConfig = NonNullable<BetterAuthOptions["socialProviders"]>;

function hasPair(id?: string, secret?: string): id is string {
  return Boolean(id && secret);
}

async function buildAppleClientSecret(
  clientId: string,
  teamId: string,
  keyId: string,
  privateKeyPem: string,
): Promise<string> {
  const normalizedKey = privateKeyPem.replace(/\\n/g, "\n");
  const key = await importPKCS8(normalizedKey, "ES256");
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: keyId })
    .setIssuer(teamId)
    .setSubject(clientId)
    .setAudience("https://appleid.apple.com")
    .setIssuedAt(now)
    .setExpirationTime(now + 180 * 24 * 60 * 60)
    .sign(key);
}

function isAppleConfigured(env: ServerEnv): boolean {
  return Boolean(
    env.APPLE_CLIENT_ID &&
      env.APPLE_TEAM_ID &&
      env.APPLE_KEY_ID &&
      env.APPLE_PRIVATE_KEY,
  );
}

export function getEnabledOAuthProviders(env: ServerEnv): OAuthProviderId[] {
  const enabled: OAuthProviderId[] = [];

  if (hasPair(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET)) {
    enabled.push("google");
  }
  if (hasPair(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET)) {
    enabled.push("github");
  }
  if (hasPair(env.FACEBOOK_CLIENT_ID, env.FACEBOOK_CLIENT_SECRET)) {
    enabled.push("facebook");
  }
  if (isAppleConfigured(env)) {
    enabled.push("apple");
  }
  if (hasPair(env.MICROSOFT_CLIENT_ID, env.MICROSOFT_CLIENT_SECRET)) {
    enabled.push("microsoft");
  }
  if (hasPair(env.DISCORD_CLIENT_ID, env.DISCORD_CLIENT_SECRET)) {
    enabled.push("discord");
  }
  if (hasPair(env.LINKEDIN_CLIENT_ID, env.LINKEDIN_CLIENT_SECRET)) {
    enabled.push("linkedin");
  }

  return enabled;
}

export interface OAuthProviderStatus {
  id: OAuthProviderId;
  enabled: boolean;
}

export function getOAuthProviderStatuses(env: ServerEnv): OAuthProviderStatus[] {
  const enabledIds = new Set(getEnabledOAuthProviders(env));
  return OAUTH_PROVIDER_IDS.map((id) => ({ id, enabled: enabledIds.has(id) }));
}

export function buildSocialProviders(env: ServerEnv): SocialProvidersConfig {
  const providers: SocialProvidersConfig = {};

  if (hasPair(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET)) {
    providers.google = {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    };
  }

  if (hasPair(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET)) {
    providers.github = {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    };
  }

  if (hasPair(env.FACEBOOK_CLIENT_ID, env.FACEBOOK_CLIENT_SECRET)) {
    providers.facebook = {
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    };
  }

  if (isAppleConfigured(env)) {
    const clientId = env.APPLE_CLIENT_ID!;
    const teamId = env.APPLE_TEAM_ID!;
    const keyId = env.APPLE_KEY_ID!;
    const privateKey = env.APPLE_PRIVATE_KEY!;
    const appBundleIdentifier = env.APPLE_APP_BUNDLE_IDENTIFIER;

    providers.apple = async () => ({
      clientId,
      clientSecret: await buildAppleClientSecret(clientId, teamId, keyId, privateKey),
      ...(appBundleIdentifier ? { appBundleIdentifier } : {}),
    });
  }

  if (hasPair(env.MICROSOFT_CLIENT_ID, env.MICROSOFT_CLIENT_SECRET)) {
    providers.microsoft = {
      clientId: env.MICROSOFT_CLIENT_ID,
      clientSecret: env.MICROSOFT_CLIENT_SECRET,
    };
  }

  if (hasPair(env.DISCORD_CLIENT_ID, env.DISCORD_CLIENT_SECRET)) {
    providers.discord = {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    };
  }

  if (hasPair(env.LINKEDIN_CLIENT_ID, env.LINKEDIN_CLIENT_SECRET)) {
    providers.linkedin = {
      clientId: env.LINKEDIN_CLIENT_ID,
      clientSecret: env.LINKEDIN_CLIENT_SECRET,
    };
  }

  return providers;
}

export function buildTrustedOrigins(env: ServerEnv): string[] {
  if (!isAppleConfigured(env)) return [];
  return ["https://appleid.apple.com"];
}

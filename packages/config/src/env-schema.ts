/**
 * Pure environment schema + parser — no side effects, no process.env access.
 *
 * `server.ts` wires this to process.env at startup (fail-fast); unit tests
 * import this module directly with arbitrary input.
 */
import { z } from 'zod'

export const serverSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL must be a non-empty connection string'),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, 'BETTER_AUTH_SECRET must be at least 32 characters (use: openssl rand -base64 32)'),
  BETTER_AUTH_URL: z
    .string()
    .url('BETTER_AUTH_URL must be a valid URL (e.g. http://localhost:3000)'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_CLIENT_ID: z.string().optional(),
  FACEBOOK_CLIENT_SECRET: z.string().optional(),
  APPLE_CLIENT_ID: z.string().optional(),
  APPLE_TEAM_ID: z.string().optional(),
  APPLE_KEY_ID: z.string().optional(),
  APPLE_PRIVATE_KEY: z.string().optional(),
  APPLE_APP_BUNDLE_IDENTIFIER: z.string().optional(),
  MICROSOFT_CLIENT_ID: z.string().optional(),
  MICROSOFT_CLIENT_SECRET: z.string().optional(),
  DISCORD_CLIENT_ID: z.string().optional(),
  DISCORD_CLIENT_SECRET: z.string().optional(),
  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),
  BREVO_API_KEY: z.string().optional(),
  EMAIL_FROM: z
    .string()
    .email('EMAIL_FROM must be a valid email address')
    .optional(),
  EMAIL_FROM_NAME: z.string().optional(),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
})

export type ServerEnv = z.infer<typeof serverSchema>

/**
 * Parse and validate a raw environment object against the server schema.
 * Throws a readable, actionable error listing every invalid field.
 */
export function parseServerEnv(
  env: Record<string, string | undefined>,
): ServerEnv {
  const result = serverSchema.safeParse(env)

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    const lines = Object.entries(fieldErrors)
      .map(([field, messages]) => `  • ${field}: ${(messages ?? []).join(', ')}`)
      .join('\n')

    throw new Error(
      `\n\n❌ Invalid server environment variables:\n${lines}\n\n` +
        `Copy .env.example to .env and fill in the required values.\n`,
    )
  }

  return result.data
}

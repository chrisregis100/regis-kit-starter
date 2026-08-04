/**
 * Server environment schema.
 *
 * Loaded ONCE at server startup. Throws with a clear error message if any
 * required variable is missing or invalid — fail fast before serving traffic.
 *
 * ⚠️  Never import this file in client-side code.
 */
import 'dotenv/config'
import { z } from 'zod'

const serverSchema = z.object({
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
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
})

export type ServerEnv = z.infer<typeof serverSchema>

function validateServerEnv(): ServerEnv {
  const result = serverSchema.safeParse(process.env)

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

/**
 * Validated server environment — typed, fail-fast.
 *
 * Import this instead of using `process.env` directly in server code.
 */
export const serverEnv: ServerEnv = validateServerEnv()

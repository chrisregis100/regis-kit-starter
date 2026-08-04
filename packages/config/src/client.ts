/**
 * Client environment schema.
 *
 * Only ever expose values that are safe for the browser.
 * Add VITE_PUBLIC_* variables here as your app grows.
 *
 * ✅  Safe to import in both server and client code.
 * ❌  Never add DATABASE_URL, secrets, or private keys here.
 */
import { z } from 'zod'

const clientSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
})

export type ClientEnv = z.infer<typeof clientSchema>

function validateClientEnv(): ClientEnv {
  const nodeEnv =
    typeof process !== 'undefined' ? process.env['NODE_ENV'] : 'development'

  const result = clientSchema.safeParse({ NODE_ENV: nodeEnv })

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    const lines = Object.entries(fieldErrors)
      .map(([field, messages]) => `  • ${field}: ${(messages ?? []).join(', ')}`)
      .join('\n')

    throw new Error(`\n\n❌ Invalid client environment variables:\n${lines}\n`)
  }

  return result.data
}

/**
 * Validated client environment — safe for browser exposure.
 */
export const clientEnv: ClientEnv = validateClientEnv()

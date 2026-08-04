/**
 * Server environment — loaded and validated ONCE at server startup.
 *
 * Throws with a clear error message if any required variable is missing or
 * invalid — fail fast before serving traffic.
 *
 * ⚠️  Never import this file in client-side code.
 */
import 'dotenv/config'
import { parseServerEnv, type ServerEnv } from './env-schema.js'

export { parseServerEnv, serverSchema, type ServerEnv } from './env-schema.js'

/**
 * Validated server environment — typed, fail-fast at startup.
 *
 * Import this instead of using `process.env` directly in server code.
 */
export const serverEnv: ServerEnv = parseServerEnv(process.env)

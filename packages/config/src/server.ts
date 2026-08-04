/**
 * Server environment — loaded and validated ONCE at server startup.
 *
 * Throws with a clear error message if any required variable is missing or
 * invalid — fail fast before serving traffic.
 *
 * ⚠️  Never import this file in client-side code.
 */
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadDotenv } from 'dotenv'
import { parseServerEnv, type ServerEnv } from './env-schema.js'

/**
 * Walk up from `startDir` until a `.env` file is found (monorepo-friendly).
 * Turbo runs `vite dev` from `apps/web`, but `.env` lives at the repo root.
 */
function findEnvFile(startDir: string): string | undefined {
  let dir = startDir

  for (let depth = 0; depth < 10; depth++) {
    const candidate = resolve(dir, '.env')
    if (existsSync(candidate)) return candidate

    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }

  return undefined
}

const moduleDir = dirname(fileURLToPath(import.meta.url))
const envPath =
  findEnvFile(process.cwd()) ??
  findEnvFile(moduleDir)

if (envPath) {
  loadDotenv({ path: envPath, override: false })
}

export { parseServerEnv, serverSchema, type ServerEnv } from './env-schema.js'

/**
 * Validated server environment — typed, fail-fast at startup.
 *
 * Import this instead of using `process.env` directly in server code.
 */
export const serverEnv: ServerEnv = parseServerEnv(process.env)

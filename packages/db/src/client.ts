/**
 * PostgreSQL pool + Drizzle client — lazily initialised on first access.
 *
 * The pool is created when `getPool()` or `getDb()` is first called. This
 * means importing this module does NOT immediately require DATABASE_URL;
 * validation happens at the call site (which is always in request context).
 *
 * For migrations (drizzle-kit), the connection string is read from
 * drizzle.config.ts which references process.env directly.
 */
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema/index.js'

export type DbSchema = typeof schema
export type Db = NodePgDatabase<DbSchema>

interface DbClient {
  pool: Pool
  db: Db
}

let _client: DbClient | null = null

function initClient(): DbClient {
  const url = process.env['DATABASE_URL']
  if (!url) {
    throw new Error(
      '[rk-kit/db] DATABASE_URL is not set.\n' +
        'Load .env (via @rk-kit/config) before using the database client.',
    )
  }
  const pool = new Pool({
    connectionString: url,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  })
  pool.on('error', (err) => {
    console.error('[rk-kit/db] Pool error:', err.message)
  })
  const db = drizzle(pool, { schema })
  _client = { pool, db }
  return _client
}

/** Returns the shared pg Pool, creating it on first call. */
export function getPool(): Pool {
  return (_client ?? initClient()).pool
}

/** Returns the shared Drizzle database instance, creating it on first call. */
export function getDb(): Db {
  return (_client ?? initClient()).db
}

/**
 * Create an isolated client from a specific connection string.
 * Useful in tests to point at a test database without polluting the shared client.
 */
export function createDb(connectionString: string): Db {
  const pool = new Pool({ connectionString })
  return drizzle(pool, { schema })
}

/** Gracefully drain and close the shared pool (use in shutdown hooks). */
export async function closePool(): Promise<void> {
  if (_client) {
    await _client.pool.end()
    _client = null
  }
}

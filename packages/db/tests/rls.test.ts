/**
 * RLS integration tests — require a migrated PostgreSQL database.
 *
 * Connections:
 *   RLS_TEST_ADMIN_URL — owner role (runs migrations, seeds fixtures)
 *   RLS_TEST_APP_URL   — restricted `app_user` role (NOBYPASSRLS) used at runtime
 *
 * Defaults match the local docker-compose / CI setup. When no database is
 * reachable the suite is skipped so `pnpm test` stays usable offline.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { config as loadDotenv } from 'dotenv'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Pool } from 'pg'

loadDotenv({
  path: resolve(dirname(fileURLToPath(import.meta.url)), '../../../.env'),
})

const ADMIN_URL =
  process.env['RLS_TEST_ADMIN_URL'] ??
  process.env['DATABASE_URL_MIGRATIONS'] ??
  'postgresql://rk_kit:rk_kit_secret@localhost:5432/rk_kit_dev'
const APP_URL =
  process.env['RLS_TEST_APP_URL'] ??
  process.env['DATABASE_URL'] ??
  'postgresql://app_user:change-me-in-production@localhost:5432/rk_kit_dev'

const ORG_A = 'rls-test-org-a'
const ORG_B = 'rls-test-org-b'

async function probeDatabase(): Promise<boolean> {
  const pool = new Pool({ connectionString: ADMIN_URL, connectionTimeoutMillis: 2_000 })
  try {
    await pool.query('SELECT 1')
    return true
  } catch {
    return false
  } finally {
    await pool.end()
  }
}

const dbAvailable = await probeDatabase()

describe.runIf(dbAvailable)('RLS tenant isolation', () => {
  let admin: Pool
  let app: Pool

  /** Insert a row as admin with the tenant context set (FORCE RLS applies to the owner too). */
  async function seedProject(orgId: string, name: string): Promise<void> {
    const client = await admin.connect()
    try {
      await client.query('BEGIN')
      await client.query(
        "SELECT set_config('app.current_organization_id', $1, true)",
        [orgId],
      )
      await client.query(
        `INSERT INTO "project" ("id", "organizationId", "name") VALUES ($1, $2, $3)`,
        [`${orgId}-${name}`, orgId, name],
      )
      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  /** Query projects as the restricted app role, with an optional tenant context. */
  async function queryAsApp(orgId?: string): Promise<Array<{ name: string }>> {
    const client = await app.connect()
    try {
      await client.query('BEGIN')
      if (orgId) {
        await client.query(
          "SELECT set_config('app.current_organization_id', $1, true)",
          [orgId],
        )
      }
      // No WHERE clause on purpose: RLS alone must do the filtering.
      const result = await client.query(`SELECT "name" FROM "project" ORDER BY "name"`)
      await client.query('COMMIT')
      return result.rows as Array<{ name: string }>
    } finally {
      client.release()
    }
  }

  beforeAll(async () => {
    admin = new Pool({ connectionString: ADMIN_URL })
    app = new Pool({ connectionString: APP_URL })

    // Fixtures: two organizations, one project each
    await admin.query(
      `INSERT INTO "organization" ("id", "name", "createdAt")
       VALUES ($1, 'Org A', now()), ($2, 'Org B', now())
       ON CONFLICT ("id") DO NOTHING`,
      [ORG_A, ORG_B],
    )
    await seedProject(ORG_A, 'alpha-project')
    await seedProject(ORG_B, 'beta-project')
  })

  afterAll(async () => {
    if (admin) {
      // FORCE RLS applies to the owner: set the tenant context to delete fixtures
      for (const orgId of [ORG_A, ORG_B]) {
        const client = await admin.connect()
        try {
          await client.query('BEGIN')
          await client.query(
            "SELECT set_config('app.current_organization_id', $1, true)",
            [orgId],
          )
          await client.query(`DELETE FROM "project" WHERE "organizationId" = $1`, [orgId])
          await client.query('COMMIT')
        } finally {
          client.release()
        }
      }
      await admin.query(`DELETE FROM "organization" WHERE "id" IN ($1, $2)`, [ORG_A, ORG_B])
      await admin.end()
    }
    if (app) await app.end()
  })

  it('app role only sees rows of the active tenant (org A)', async () => {
    const rows = await queryAsApp(ORG_A)
    expect(rows.map((r) => r.name)).toContain('alpha-project')
    expect(rows.map((r) => r.name)).not.toContain('beta-project')
  })

  it('app role only sees rows of the active tenant (org B)', async () => {
    const rows = await queryAsApp(ORG_B)
    expect(rows.map((r) => r.name)).toContain('beta-project')
    expect(rows.map((r) => r.name)).not.toContain('alpha-project')
  })

  it('fail-safe: no tenant context → zero rows (not a leak)', async () => {
    const rows = await queryAsApp()
    expect(rows).toHaveLength(0)
  })

  it('app role cannot insert rows for another tenant (WITH CHECK)', async () => {
    const client = await app.connect()
    try {
      await client.query('BEGIN')
      await client.query(
        "SELECT set_config('app.current_organization_id', $1, true)",
        [ORG_A],
      )
      await expect(
        client.query(
          `INSERT INTO "project" ("id", "organizationId", "name") VALUES ($1, $2, $3)`,
          ['rls-cross-tenant-insert', ORG_B, 'evil-project'],
        ),
      ).rejects.toThrowError(/row-level security/)
      await client.query('ROLLBACK')
    } finally {
      client.release()
    }
  })

  it('app role cannot bypass RLS (NOBYPASSRLS attribute)', async () => {
    const result = await app.query(
      `SELECT rolbypassrls, rolsuper FROM pg_roles WHERE rolname = current_user`,
    )
    expect(result.rows[0]).toEqual({ rolbypassrls: false, rolsuper: false })
  })
})

describe.runIf(!dbAvailable)('RLS tenant isolation (skipped)', () => {
  it.skip('database not reachable — start it with `docker compose up -d` and run migrations', () => {})
})

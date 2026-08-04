/**
 * Multi-tenant context propagation via PostgreSQL transaction-local settings.
 *
 * How it works
 * ────────────
 * 1. A service calls `withTenant(organizationId, async (tx) => { ... })`.
 * 2. Inside the transaction, `set_config('app.current_organization_id', id, true)`
 *    is executed with `is_local = true`, making the setting valid only for this
 *    transaction (it is automatically cleared when the transaction ends).
 * 3. The RLS policies on business tables read
 *    `current_setting('app.current_organization_id', true)` and reject rows
 *    whose `organization_id` does not match.
 *
 * ⚠️  The application role connecting to the database MUST NOT be a superuser
 *     and MUST NOT have the BYPASSRLS attribute — otherwise RLS is skipped.
 *     See migrations/0002_rls.sql for the role setup instructions.
 *
 * Example
 * ───────
 * ```ts
 * const projects = await withTenant(session.activeOrganizationId, (tx) =>
 *   tx.select().from(project)
 * )
 * ```
 */
import { sql } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { getDb, type DbSchema } from './client.js'

export type TenantTx = NodePgDatabase<DbSchema>

/**
 * Run `fn` inside a transaction with the tenant context set to `organizationId`.
 *
 * All RLS-protected queries inside `fn` will be filtered to this organization.
 */
export async function withTenant<T>(
  organizationId: string,
  fn: (tx: TenantTx) => Promise<T>,
): Promise<T> {
  if (!organizationId || organizationId.trim() === '') {
    throw new Error('[rk-kit/db] withTenant: organizationId must not be empty')
  }

  return getDb().transaction(async (tx) => {
    // set_config(key, value, is_local=true) → lives only for this transaction
    await tx.execute(
      sql`SELECT set_config('app.current_organization_id', ${organizationId}, true)`,
    )
    return fn(tx as TenantTx)
  })
}

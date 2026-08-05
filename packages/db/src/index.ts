/**
 * @rk-kit/db
 *
 * PostgreSQL client (pg Pool) + Drizzle ORM, schema, and tenant context.
 *
 * Exports:
 *   getDb()             — shared Drizzle instance (lazy init)
 *   getPool()           — shared pg.Pool (lazy init)
 *   createDb(url)       — isolated db for testing
 *   closePool()         — graceful shutdown
 *   withTenant(id, fn)  — run fn in a tx with RLS tenant context set
 *   schema              — named schema object for Better Auth drizzleAdapter
 *
 *   All individual schema tables re-exported directly as well.
 */

// ── Client ────────────────────────────────────────────────────────────────────
export { getDb, getPool, createDb, closePool } from "./client.js";
export type { Db, DbSchema } from "./client.js";

// ── Tenant context helper ─────────────────────────────────────────────────────
export { withTenant } from "./tenant.js";
export type { TenantTx } from "./tenant.js";

// ── Individual table exports (for service code and auth adapter) ──────────────
export {
  user,
  session,
  account,
  verification,
  organization,
  member,
  invitation,
  project,
  subscription,
  payment,
} from "./schema/index.js";
export type {
  Project,
  NewProject,
  Subscription,
  NewSubscription,
  Payment,
  NewPayment,
} from "./schema/index.js";

// ── Schema bundle (convenience for Better Auth drizzleAdapter({ schema })) ────
export * as schema from "./schema/index.js";

// ── Query operators (single ORM boundary — services never import drizzle-orm) ─
export { eq, ne, and, or, inArray, desc, asc, sql } from "drizzle-orm";

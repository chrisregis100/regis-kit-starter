/**
 * Admin service — platform-wide business logic, server-only.
 *
 * Unlike the tenant-scoped services, these queries deliberately run OUTSIDE
 * withTenant(): the platform admin needs a global view across every
 * organization. The user/session/organization tables are Better Auth tables
 * and are not RLS-protected, so a direct getDb() query returns all rows.
 *
 * Authorization is enforced upstream by requireAdmin() in the server function
 * boundary — this service assumes the caller is already the platform admin.
 *
 * The db instance is injectable so unit tests can exercise the shaping logic
 * without a real database (see admin-service.test.ts).
 */
import {
  getDb,
  eq,
  desc,
  sql,
  user,
  session,
  organization,
  type Db,
} from "@rk-kit/db";

export interface AdminActiveSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  expiresAt: Date;
}

export interface AdminDashboardData {
  totalUsers: number;
  totalOrganizations: number;
  activeSessionCount: number;
  activeSessions: AdminActiveSession[];
}

/** Number of rows in a table via a single COUNT(*) query. */
async function countRows(db: Db, table: typeof user | typeof organization): Promise<number> {
  const rows = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(table);
  return rows[0]?.value ?? 0;
}

async function countActiveSessions(db: Db): Promise<number> {
  const rows = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(session)
    .where(sql`${session.expiresAt} > now()`);
  return rows[0]?.value ?? 0;
}

/**
 * Aggregate platform metrics + the list of currently active (non-expired)
 * sessions, each enriched with the owning user's name and email.
 */
export async function getAdminDashboardData(
  db: Db = getDb(),
): Promise<AdminDashboardData> {
  const [totalUsers, totalOrganizations, activeSessionCount, activeSessions] =
    await Promise.all([
      countRows(db, user),
      countRows(db, organization),
      countActiveSessions(db),
      db
        .select({
          id: session.id,
          userId: session.userId,
          userName: user.name,
          userEmail: user.email,
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
          createdAt: session.createdAt,
          expiresAt: session.expiresAt,
        })
        .from(session)
        .innerJoin(user, eq(session.userId, user.id))
        .where(sql`${session.expiresAt} > now()`)
        .orderBy(desc(session.createdAt))
        .limit(100),
    ]);

  return {
    totalUsers,
    totalOrganizations,
    activeSessionCount,
    activeSessions,
  };
}

/**
 * Unit tests for the admin service — no database required.
 *
 * A fake Drizzle-like db is injected. It ignores the query builder chain and
 * resolves canned results based on the table passed to `.from()`, so the test
 * exercises the shaping/aggregation logic without a real connection.
 */
import { describe, expect, it } from "vitest";
import { organization, user, type Db } from "@rk-kit/db";
import {
  getAdminDashboardData,
  type AdminActiveSession,
} from "./admin-service";

interface FakeResults {
  users: number;
  orgs: number;
  sessions: AdminActiveSession[];
}

function makeFakeDb(results: FakeResults): Db {
  function makeBuilder(fromTable: unknown) {
    const resolve = (): unknown => {
      if (fromTable === user) return [{ value: results.users }];
      if (fromTable === organization) return [{ value: results.orgs }];
      return results.sessions;
    };

    const builder = {
      innerJoin: () => builder,
      where: () => builder,
      orderBy: () => builder,
      limit: () => builder,
      then: (onFulfilled: (value: unknown) => unknown) =>
        Promise.resolve(resolve()).then(onFulfilled),
    };
    return builder;
  }

  return {
    select: () => ({ from: (table: unknown) => makeBuilder(table) }),
  } as unknown as Db;
}

const fakeSession: AdminActiveSession = {
  id: "s1",
  userId: "u1",
  userName: "Ada Lovelace",
  userEmail: "ada@example.com",
  ipAddress: "203.0.113.7",
  userAgent: "Mozilla/5.0",
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 3_600_000),
};

describe("getAdminDashboardData", () => {
  it("aggregates counts and returns active sessions", async () => {
    const db = makeFakeDb({ users: 12, orgs: 3, sessions: [fakeSession] });

    const data = await getAdminDashboardData(db);

    expect(data.totalUsers).toBe(12);
    expect(data.totalOrganizations).toBe(3);
    expect(data.activeSessionCount).toBe(1);
    expect(data.activeSessions).toEqual([fakeSession]);
  });

  it("handles an empty platform", async () => {
    const db = makeFakeDb({ users: 0, orgs: 0, sessions: [] });

    const data = await getAdminDashboardData(db);

    expect(data.totalUsers).toBe(0);
    expect(data.totalOrganizations).toBe(0);
    expect(data.activeSessionCount).toBe(0);
    expect(data.activeSessions).toEqual([]);
  });
});

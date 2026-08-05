/**
 * Unit tests for the platform-admin helper.
 *
 * The environment (`serverEnv`) and the Better Auth instance (`./config.js`)
 * are mocked so the test exercises only the pure isAdmin comparison logic
 * without loading the real config or opening a database connection.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const { serverEnvMock } = vi.hoisted(() => ({
  serverEnvMock: { ADMIN_EMAIL: undefined as string | undefined },
}));

vi.mock("@rk-kit/config", () => ({ serverEnv: serverEnvMock }));
vi.mock("./config.js", () => ({ auth: { api: {} } }));

import { isAdmin } from "./helpers";

beforeEach(() => {
  serverEnvMock.ADMIN_EMAIL = undefined;
});

describe("isAdmin", () => {
  it("returns false when ADMIN_EMAIL is unset", () => {
    expect(isAdmin("someone@example.com")).toBe(false);
  });

  it("matches the admin email case-insensitively and trims whitespace", () => {
    serverEnvMock.ADMIN_EMAIL = "Admin@Example.com";
    expect(isAdmin("admin@example.com")).toBe(true);
    expect(isAdmin("  ADMIN@EXAMPLE.COM  ")).toBe(true);
  });

  it("returns false for a non-admin email", () => {
    serverEnvMock.ADMIN_EMAIL = "admin@example.com";
    expect(isAdmin("intruder@example.com")).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { isAnyProviderConfigured } from "@rk-kit/billing";
import type { ServerEnv } from "@rk-kit/config";

const baseEnv: ServerEnv = {
  DATABASE_URL: "postgresql://u:p@localhost:5432/db",
  BETTER_AUTH_SECRET: "a".repeat(32),
  BETTER_AUTH_URL: "http://localhost:3000",
  NODE_ENV: "development",
  PORT: 3000,
};

describe("billing availability", () => {
  it("returns false when no provider is configured", () => {
    expect(isAnyProviderConfigured(baseEnv)).toBe(false);
  });
});

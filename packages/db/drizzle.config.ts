import { config } from "dotenv";
import type { Config } from "drizzle-kit";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env") });

/**
 * drizzle-kit configuration.
 *
 * Commands (run from packages/db):
 *   pnpm db:generate   — diff schema → generate migration SQL
 *   pnpm db:migrate    — apply pending migrations
 *   pnpm db:studio     — open Drizzle Studio (visual DB browser)
 *
 * Role note: use the superuser/owner role for migrations (BYPASSRLS is needed
 * to apply ALTER TABLE … ENABLE ROW LEVEL SECURITY). The application role
 * `app_user` is a restricted role created by migration 0002_rls_policies.sql.
 */
export default {
  schema: "./src/schema/index.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    url: process.env["DATABASE_URL"] ?? "",
  },
} satisfies Config;

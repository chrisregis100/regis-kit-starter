import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(currentDirectory, "../../.env") });

const appDatabasePassword = process.env.APP_DB_PASSWORD;

if (appDatabasePassword) {
  const migrationDatabaseUrl =
    process.env.DATABASE_URL_MIGRATIONS ?? process.env.DATABASE_URL;

  if (!migrationDatabaseUrl) {
    throw new Error(
      "DATABASE_URL_MIGRATIONS or DATABASE_URL must be set to synchronize app_user.",
    );
  }

  const pool = new Pool({ connectionString: migrationDatabaseUrl });

  try {
    const result = await pool.query(
      "SELECT format('ALTER ROLE app_user PASSWORD %L', $1) AS statement",
      [appDatabasePassword],
    );
    const statement = result.rows[0]?.statement;

    if (!statement) throw new Error("Could not build the app_user password statement.");

    await pool.query(statement);
  } finally {
    await pool.end();
  }
}

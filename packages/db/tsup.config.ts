import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: false,
  clean: true,
  sourcemap: true,
  // pg and drizzle-orm are runtime dependencies — bundle nothing from them.
  external: ["pg", "drizzle-orm", "drizzle-orm/node-postgres", "drizzle-orm/pg-core"],
});

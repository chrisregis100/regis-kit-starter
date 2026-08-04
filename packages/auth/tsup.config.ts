import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: false,
  clean: true,
  sourcemap: true,
  external: ["better-auth", "@rk-kit/config", "@rk-kit/db", "@rk-kit/errors"],
});

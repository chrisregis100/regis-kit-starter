import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/server.ts", "src/client.ts"],
  format: ["esm"],
  dts: false,
  clean: true,
  sourcemap: true,
});

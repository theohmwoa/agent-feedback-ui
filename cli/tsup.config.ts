import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cli.ts"],
  format: ["esm"],
  outDir: "dist",
  target: "node18",
  clean: true,
  splitting: false,
  shims: true,
  banner: { js: "#!/usr/bin/env node" },
});

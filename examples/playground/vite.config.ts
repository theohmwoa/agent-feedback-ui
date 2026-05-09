import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// GitHub Pages serves the repo at /agent-feedback-ui/.
// In dev mode the base is /; in prod it has the repo prefix so asset URLs resolve.
const repoBase = "/agent-feedback-ui/";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? repoBase : "/",
  resolve: {
    alias: {
      // The playground imports from `agent-feedback-ui/*` exactly the way a
      // consumer would. Aliased to the lib's source so we don't depend on
      // a pre-built dist/.
      "agent-feedback-ui/templates": resolve(
        __dirname,
        "../../src/templates.ts",
      ),
      "agent-feedback-ui/ai-sdk": resolve(__dirname, "../../src/ai-sdk.ts"),
      "agent-feedback-ui": resolve(__dirname, "../../src/index.ts"),
    },
  },
}));

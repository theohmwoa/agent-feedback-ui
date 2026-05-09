import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const repoBase = "/agent-feedback-ui/";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? repoBase : "/",
  resolve: {
    alias: {
      // The playground imports from `agent-feedback-ui/*` exactly the way a
      // consumer would. Aliased to the lib's source so applyFeedback &
      // friends are real, not simulated.
      "agent-feedback-ui/templates": resolve(
        __dirname,
        "../../src/templates.ts",
      ),
      "agent-feedback-ui/ai-sdk": resolve(__dirname, "../../src/ai-sdk.ts"),
      "agent-feedback-ui/react": resolve(__dirname, "../../src/react.ts"),
      "agent-feedback-ui": resolve(__dirname, "../../src/index.ts"),
    },
  },
}));

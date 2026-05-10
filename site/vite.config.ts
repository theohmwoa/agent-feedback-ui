import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repoBase = "/agent-feedback-ui/";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? repoBase : "/",
}));

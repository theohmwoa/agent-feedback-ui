import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The email template is React. Use happy-dom for the .test.tsx files;
    // pure-TS strategy/adapter tests don't need it but it's cheap to leave on.
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.ts"],
  },
});

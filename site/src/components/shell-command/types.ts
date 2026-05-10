import type { AgentMeta } from "../../types";

export type ShellRisk = "safe" | "caution" | "danger";

export type ShellIntent = AgentMeta & {
  command: string;
  cwd?: string;
  shell?: "zsh" | "bash" | "fish" | "sh";
  expectedEffect?: string;
  dryRun?: string[];
  risk?: ShellRisk;
};

export type ShellPayload = {
  command: string;
  cwd: string;
};

export const SHELL_DEFAULT: ShellIntent = {
  agent: "atlas",
  action: "run-shell",
  command: "rg --files src/ | xargs sed -i '' 's/REQUEST_ID/X-Trace-Id/g'",
  cwd: "~/nordlight/api-gateway",
  shell: "zsh",
  expectedEffect: "Renames the REQUEST_ID header to X-Trace-Id across all source files. Modifies ~24 files.",
  dryRun: [
    "src/middleware/trace.ts",
    "src/middleware/auth.ts",
    "src/handlers/proxy.ts",
    "src/handlers/health.ts",
    "src/lib/headers.ts",
    "… 19 more",
  ],
  risk: "caution",
  rationale: "PR #4188 needs the header renamed for consistency with the new tracing spec. Inferred the pattern from your last commit message.",
};

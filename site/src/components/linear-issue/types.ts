import type { AgentMeta } from "../../types";

export type LinearPriority = "No" | "Low" | "Med" | "High" | "Urgent";

export type LinearIntent = AgentMeta & {
  team: string;
  identifier: string;
  title: string;
  description: string;
  priority: LinearPriority;
  status: string;
  labels: string[];
  assignee: { name: string; role?: string };
  estimate?: number;
  cycle?: string;
  related?: string[];
};

export type LinearPayload = {
  title: string;
  description: string;
  priority: LinearPriority;
  labels: string[];
};

export const LINEAR_DEFAULT: LinearIntent = {
  agent: "atlas",
  action: "create-issue",
  team: "PLAT",
  identifier: "PLAT-241",
  title: "JWT verification blocks event loop on auth gateway hot path",
  description: `## Context
Production p99 on the auth gateway has been over 800ms since the 09:14 UTC deploy. Profiling shows the new \`@nl/jwt\` library calls \`crypto.verify\` synchronously on every request without caching the public key.

## Repro
\`\`\`
ab -n 5000 -c 50 https://auth.nordlight.cloud/verify
\`\`\`

## Proposed fix
Cache the resolved public key in module scope, keyed by \`kid\`. PR #4187 has the patch + a regression test.`,
  priority: "Urgent",
  status: "Triage",
  labels: ["performance", "auth-gateway"],
  assignee: { name: "Priya Raman", role: "on-call" },
  estimate: 2,
  cycle: "Cycle 23",
  related: ["PLAT-198"],
  rationale: "Tied to the active incident in #eng-platform. Pulled stack frame and PR link from your local profiling session.",
};

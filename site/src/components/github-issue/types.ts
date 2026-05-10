import type { AgentMeta } from "../../types";

export type GhLabel = { name: string; color: string };

export type GithubIssueIntent = AgentMeta & {
  repo: string;
  title: string;
  body: string;
  labels: GhLabel[];
  assignees: string[];
  milestone?: string;
  template?: string;
};

export type GithubIssuePayload = {
  repo: string;
  title: string;
  body: string;
  labels: string[];
  assignees: string[];
  milestone?: string;
};

export const GITHUB_ISSUE_DEFAULT: GithubIssueIntent = {
  agent: "atlas",
  action: "create-issue",
  repo: "nordlight/api-gateway",
  title: "Auth gateway: synchronous JWT verify blocks event loop on hot path",
  body: `## Summary
Profiling on \`auth-gateway\` shows \`@nl/jwt\` calls \`crypto.verify\` synchronously per request. Public-key resolution isn't cached.

## Repro
\`\`\`
ab -n 5000 -c 50 https://auth.nordlight.cloud/verify
\`\`\`

## Proposed fix
Module-scoped LRU keyed by \`kid\`. Patch in #4187.

## Environment
- Node 22.4.0
- @nl/jwt@2.1.0`,
  labels: [
    { name: "bug",         color: "oklch(0.68 0.18 25)" },
    { name: "performance", color: "oklch(0.74 0.15 50)" },
    { name: "P0",          color: "oklch(0.66 0.20 25)" },
  ],
  assignees: ["priyaraman", "jchen"],
  milestone: "v3.4 — Q3 stability",
  template: "bug-report.md",
  rationale: "Surfaced from the active incident in #eng-platform, tied to the PR you reviewed yesterday.",
};

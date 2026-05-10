import type { AgentMeta } from "../../types";

export type PrReviewKind = "approve" | "comment" | "request_changes";

export type PrCheck = {
  name: string;
  status: "ok" | "fail" | "pending";
};

export type PrIntent = AgentMeta & {
  repo: string;
  number: number;
  title: string;
  author: string;
  branch: string;
  baseBranch: string;
  filesChanged: number;
  added: number;
  deleted: number;
  checks: PrCheck[];
  summary: string;
  draftReviewKind?: PrReviewKind;
  draftBody?: string;
};

export type PrReviewPayload = {
  repo: string;
  number: number;
  kind: PrReviewKind;
  body: string;
};

export const PR_DEFAULT: PrIntent = {
  agent: "atlas",
  action: "review-pr",
  repo: "nordlight/api-gateway",
  number: 4187,
  title: "fix(jwt): cache resolved public key per kid",
  author: "priyaraman",
  branch: "fix/jwt-key-cache",
  baseBranch: "main",
  filesChanged: 3,
  added: 42,
  deleted: 6,
  checks: [
    { name: "ci/build",        status: "ok" },
    { name: "ci/test",         status: "ok" },
    { name: "ci/lint",         status: "ok" },
    { name: "ci/perf-canary",  status: "pending" },
  ],
  summary: `Module-scoped LRU keyed by \`kid\`, max=32, ttl=1h. Adds a regression test that fails if /verify p99 > 200ms over a 5k-request burst. Verified locally — p99 drops from 880ms → 130ms.`,
  draftReviewKind: "approve",
  draftBody: "LGTM — the LRU sizing and TTL look right for our key rotation cadence. Optional follow-up: log a metric on cache miss so we can spot eviction storms.",
  rationale: "Read the PR + the linked perf graph. Caching matches the proposal in the linked issue; perf canary still pending but tests pass.",
};

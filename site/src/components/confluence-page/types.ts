import type { AgentMeta } from "../../types";

export type ConfluenceRestriction = "open" | "read-only" | "private";

export type ConfluenceIntent = AgentMeta & {
  space: string;
  parentBreadcrumb: string[];
  title: string;
  body: string;
  labels: string[];
  restriction?: ConfluenceRestriction;
  watchers?: number;
  isNew?: boolean;
};

export type ConfluencePayload = {
  space: string;
  title: string;
  body: string;
  labels: string[];
  restriction: ConfluenceRestriction;
};

export const CONFLUENCE_DEFAULT: ConfluenceIntent = {
  agent: "atlas",
  action: "update-page",
  space: "ENG",
  parentBreadcrumb: ["Engineering", "Runbooks", "Auth gateway"],
  title: "Auth gateway — public-key cache (post-incident notes)",
  body: `h2. Background
After the May 10 incident, we cached resolved public keys per \`kid\`. This page documents the contract.

h2. Cache configuration
* TTL: 1h
* Max entries: 32
* Eviction: LRU
* Keyed on: JWT \`kid\` header

h2. Operational notes
* Cache miss on a key rotation is expected — we accept one slow request per kid per hour.
* Module-scoped: warm across requests in the same process, cold on deploy.

h2. Open questions
* Do we want per-tenant TTLs?
* Should we expose cache stats via /metrics?`,
  labels: ["auth-gateway", "post-incident", "runbook", "performance"],
  restriction: "open",
  watchers: 7,
  rationale: "Drafted from PR #4187 + the Slack post-incident thread. Wiki-style markup matches the rest of the ENG space.",
};

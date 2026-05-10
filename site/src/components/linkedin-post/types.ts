import type { AgentMeta } from "../../types";

export type LinkedInAudience = "anyone" | "connections" | "group";

export type LinkedInMedia = {
  kind: "image" | "video" | "document";
  alt?: string;
  hue?: number;
};

export type LinkedInIntent = AgentMeta & {
  profile: { name: string; headline: string };
  audience?: LinkedInAudience;
  groupName?: string;
  body: string;
  media?: LinkedInMedia[];
  hashtags?: string[];
  shareToCompanies?: string[];
};

export type LinkedInPayload = {
  body: string;
  audience: LinkedInAudience;
  hashtags: string[];
  media: LinkedInMedia[];
  shareToCompanies: string[];
};

export const LINKEDIN_POST_DEFAULT: LinkedInIntent = {
  agent: "atlas",
  action: "post-linkedin",
  profile: {
    name: "Theophilus Homawoo",
    headline: "Building agent infra @ Nordlight · ex-Mirage AI",
  },
  audience: "anyone",
  body: `Three weeks ago we shipped a JWT verifier that pulled the public key on every request. Last Tuesday it ate our auth gateway p99.

The fix was 12 lines: an LRU keyed by \`kid\`, capped at 32 entries, 1h TTL. p99 went from 880ms back to 130ms.

Lessons (re-)learned:
- "stateless" verification still has cacheable state
- module-scope is fine when the cache is bounded
- the regression test that caught it post-fix is now the canary

Write-up + the patch in the comments. Big thanks to Priya for the flame-graph triage.`,
  media: [
    { kind: "image", alt: "p99 latency before/after graph", hue: 240 },
  ],
  hashtags: ["distributedSystems", "performance", "engineering"],
  rationale: "Pulled from the postmortem you wrote. Tone matched to your last 3 LinkedIn posts (technical narrative, lessons-list pattern). Two suggested companies to share with based on followers' overlap.",
  shareToCompanies: ["Nordlight"],
};

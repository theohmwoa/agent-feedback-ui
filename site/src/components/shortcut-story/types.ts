import type { AgentMeta } from "../../types";

export type ShortcutStoryType = "feature" | "bug" | "chore";

export type ShortcutIntent = AgentMeta & {
  workflow: string;
  state: string;
  title: string;
  description: string;
  storyType: ShortcutStoryType;
  epic?: { id: string; name: string };
  labels: string[];
  estimate?: number;
  owners: { name: string }[];
  iteration?: string;
};

export type ShortcutPayload = {
  workflow: string;
  state: string;
  title: string;
  description: string;
  storyType: ShortcutStoryType;
  epicId?: string;
  labels: string[];
  estimate?: number;
  owners: string[];
};

export const SHORTCUT_DEFAULT: ShortcutIntent = {
  agent: "atlas",
  action: "create-story",
  workflow: "Engineering",
  state: "Ready for Dev",
  title: "Cache JWT public keys to fix p99 regression on /verify",
  description: `### Problem
Auth gateway p99 jumped from 120ms → 880ms after the @nl/jwt 2.1.0 deploy. The library does \`crypto.verify\` synchronously per request and re-fetches the public key every time.

### Acceptance criteria
- [ ] Public key resolution is cached with a module-scoped LRU keyed by \`kid\`
- [ ] LRU sized for our key rotation cadence (1h TTL, 32 entries)
- [ ] Regression test that fails if /verify p99 > 200ms over a 5k-request burst
- [ ] PR has perf canary green before merge`,
  storyType: "bug",
  epic: { id: "ep_2841", name: "Q3 — Auth gateway stability" },
  labels: ["performance", "auth", "p0"],
  estimate: 2,
  owners: [{ name: "Priya Raman" }, { name: "Joaquim Chen" }],
  iteration: "Iteration 23",
  rationale: "Surfaced from the active incident in #eng-platform; you reviewed the PR yesterday. Linked to the Auth-stability epic Priya owns.",
};

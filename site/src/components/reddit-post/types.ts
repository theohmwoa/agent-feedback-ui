import type { AgentMeta } from "../../types";

export type RedditPostKind = "text" | "link" | "image";

export type RedditFlair = { name: string; bg?: string; fg?: string };

export type RedditIntent = AgentMeta & {
  subreddit: string;
  subscribers?: number;
  rulesUrl?: string;
  kind?: RedditPostKind;
  title: string;
  body?: string;
  url?: string;
  flair?: RedditFlair;
  availableFlair?: RedditFlair[];
  nsfw?: boolean;
  spoiler?: boolean;
};

export type RedditPostPayload = {
  subreddit: string;
  kind: RedditPostKind;
  title: string;
  body?: string;
  url?: string;
  flair?: RedditFlair;
  nsfw: boolean;
  spoiler: boolean;
};

export const REDDIT_POST_DEFAULT: RedditIntent = {
  agent: "atlas",
  action: "post-reddit",
  subreddit: "r/programming",
  subscribers: 6_400_000,
  rulesUrl: "https://reddit.com/r/programming/about/rules",
  kind: "text",
  title: "Caching JWK by `kid` cut our auth gateway p99 from 880ms to 130ms (12-line patch)",
  body: `We shipped a new JWT verifier three weeks ago. Last Tuesday it ate our auth gateway.

Root cause: every \`/verify\` call did a synchronous \`crypto.verify\` against a remote JWK fetch. The JWK never changed but we re-fetched on every request.

Fix: module-scoped LRU keyed by \`kid\`. 32 entries, 1h TTL.

Tradeoffs we considered:
- Process-wide singleton vs per-request — went with module-scope; simpler
- TTL vs invalidation hook — TTL is enough since key rotation is daily
- Adding a regression test that fails if /verify > 200ms p99 — yes, did this in same PR

Full write-up + the patch: <link>`,
  flair: { name: "Practical Engineering", bg: "oklch(0.68 0.16 30)", fg: "oklch(0.18 0.04 30)" },
  availableFlair: [
    { name: "Practical Engineering", bg: "oklch(0.68 0.16 30)", fg: "oklch(0.18 0.04 30)" },
    { name: "Performance",            bg: "oklch(0.74 0.13 280)", fg: "oklch(0.18 0.04 280)" },
    { name: "Open Source",            bg: "oklch(0.74 0.14 165)", fg: "oklch(0.18 0.04 165)" },
  ],
  nsfw: false,
  spoiler: false,
  rationale: "Drafted from your postmortem. r/programming requires flair; pre-selected 'Practical Engineering' based on the post's subject. Title under 300 chars per sub rules.",
};

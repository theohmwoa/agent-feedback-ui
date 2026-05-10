import type { AgentMeta } from "../../types";

export type RedditCommentIntent = AgentMeta & {
  subreddit: string;
  parent: {
    author: string;
    score: number;
    body: string;
    age: string;     // "2h", "1d", etc
    distinguished?: "op" | "mod" | "admin";
  };
  reply: string;
};

export type RedditCommentPayload = {
  subreddit: string;
  parentAuthor: string;
  reply: string;
};

export const REDDIT_COMMENT_DEFAULT: RedditCommentIntent = {
  agent: "atlas",
  action: "reply-reddit",
  subreddit: "r/programming",
  parent: {
    author: "u/distributed_dan",
    score: 142,
    age: "3h",
    body: `Did you consider per-process LRU vs a shared cache (e.g. redis)? At your QPS the LRU is fine but if you scale horizontally each pod will independently fetch on cold-start, which could be a thundering-herd problem during a deploy.`,
    distinguished: "op",
  },
  reply: `Good question. We considered redis but the JWK fetch is ~30ms and we have ~12 pods, so worst-case we eat 12 cold fetches per deploy — not enough to justify the redis dep.

For thundering-herd specifically: the JWK endpoint is rate-limited at 50/s and we deploy with a 30s rolling window, so the 12 pods hit it spread out. We'd revisit if we ever scaled past ~50 pods.

The bigger argument for shared cache is actually not perf — it's correctness during key rotation. With per-process caches, mid-rotation you can have pods serving from old + new keys for ~1h. We accepted that since rotation events are rare and brief.`,
  rationale: "Replied with the technical context that's already in your postmortem. Tone matched to your other r/programming replies (concise, tradeoffs explicit).",
};

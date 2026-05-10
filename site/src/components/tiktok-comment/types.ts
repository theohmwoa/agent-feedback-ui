import type { AgentMeta } from "../../types";

export type TiktokIntent = AgentMeta & {
  video: {
    creator: string;
    creatorVerified?: boolean;
    description: string;
    sound: string;
    views: number;
    thumbHue?: number;
  };
  replyingTo?: { author: string; text: string };
  comment: string;
  isCreator?: boolean;
  pin?: boolean;
};

export type TiktokPayload = {
  videoCreator: string;
  comment: string;
  pin: boolean;
};

function formatViews(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}
export { formatViews };

export const TIKTOK_COMMENT_DEFAULT: TiktokIntent = {
  agent: "atlas",
  action: "comment-tiktok",
  video: {
    creator: "@codecanyon",
    creatorVerified: true,
    description: "the moment a perf fix actually works 🥲 #devsoftiktok #perf",
    sound: "original sound · @codecanyon",
    views: 412_300,
    thumbHue: 350,
  },
  replyingTo: { author: "@bytebakery", text: "what was the actual fix tho" },
  comment: "module-scoped LRU keyed by `kid`, 32 entries, 1h ttl. dropped p99 from 880ms to 130ms. tiny 12-line patch 🤝",
  isCreator: false,
  rationale: "Drafted from your blog post. Reply to @bytebakery's question pulled from the comment thread on this video.",
};

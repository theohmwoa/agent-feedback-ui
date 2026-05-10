import type { AgentMeta } from "../../types";

export type TwitterAudience = "everyone" | "circle" | "followers";

export type TwitterMedia = {
  kind: "image" | "video" | "gif";
  alt?: string;
  // optional thumbnail color seed for the placeholder tile
  hue?: number;
};

export type TwitterIntent = AgentMeta & {
  handle: string;
  displayName: string;
  body: string;
  audience?: TwitterAudience;
  media?: TwitterMedia[];
  poll?: { options: string[]; durationHours: number };
  scheduledAt?: string;
  replyingTo?: { handle: string; preview: string };
};

export type TwitterPayload = {
  body: string;
  audience: TwitterAudience;
  media: TwitterMedia[];
  poll?: { options: string[]; durationHours: number };
  scheduledAt?: string;
};

export const TWITTER_POST_DEFAULT: TwitterIntent = {
  agent: "atlas",
  action: "post-tweet",
  handle: "@nordlight_eng",
  displayName: "Nordlight Engineering",
  body: "shipping notes from the auth gateway hot-fix → caching the JWK by `kid` cut p99 from 880ms back to 130ms. tiny patch, big graph. write-up linked below 🔗",
  audience: "everyone",
  media: [
    { kind: "image", alt: "p99 latency graph", hue: 200 },
  ],
  rationale: "Drafted from the postmortem you wrote 20 minutes ago. Pulled the latency numbers and the punchline; linked the long-form write-up.",
};

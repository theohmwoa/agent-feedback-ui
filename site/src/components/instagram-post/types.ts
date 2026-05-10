import type { AgentMeta } from "../../types";

export type InstagramAudience = "public" | "close-friends";

export type InstagramIntent = AgentMeta & {
  handle: string;
  imageHue?: number;
  imageAlt?: string;
  caption: string;
  hashtags?: string[];
  location?: string;
  audience?: InstagramAudience;
  shareToFacebook?: boolean;
};

export type InstagramPayload = {
  caption: string;
  hashtags: string[];
  location?: string;
  audience: InstagramAudience;
  shareToFacebook: boolean;
};

export const INSTAGRAM_POST_DEFAULT: InstagramIntent = {
  agent: "atlas",
  action: "post-instagram",
  handle: "@theohmwoa",
  imageHue: 320,
  imageAlt: "studio desk · monitor showing latency graph",
  caption: `the moment p99 came back to earth.

12-line patch · cache the JWK by kid · ship Tuesday morning`,
  hashtags: ["studiolife", "sweng", "performance", "monitoring", "buildinpublic"],
  location: "San Francisco, CA",
  audience: "public",
  shareToFacebook: false,
  rationale: "Drafted from your studio photo + the auth-gateway postmortem. Caption short, hashtags pulled from your last 6 posts that performed well.",
};

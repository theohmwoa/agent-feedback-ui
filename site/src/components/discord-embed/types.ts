import type { AgentMeta } from "../../types";

export type EmbedField = { name: string; value: string; inline?: boolean };

export type DiscordEmbedIntent = AgentMeta & {
  channel: string;
  title: string;
  description: string;
  color: string;
  fields: EmbedField[];
  thumbnailUrl?: string;
  footerText?: string;
  author?: { name: string; iconUrl?: string };
};

export type DiscordEmbedPayload = {
  channel: string;
  embed: {
    title: string;
    description: string;
    color: string;
    fields: EmbedField[];
    thumbnailUrl?: string;
    footerText?: string;
    author?: { name: string; iconUrl?: string };
  };
};

export const DISCORD_EMBED_DEFAULT: DiscordEmbedIntent = {
  agent: "atlas",
  action: "post-embed",
  channel: "release-notes",
  title: "v3.4.0 — auth-gateway hot-fix",
  description: "Cached the resolved JWT public key per `kid`. Brings p99 on `/verify` from 880ms back to 130ms.",
  color: "oklch(0.74 0.13 280)",
  fields: [
    { name: "PR",          value: "#4187", inline: true },
    { name: "Author",      value: "@priya", inline: true },
    { name: "Severity",    value: "P1",    inline: true },
    { name: "Postmortem",  value: "[Notion link](#)" },
  ],
  thumbnailUrl: "https://placehold.co/64x64/png",
  footerText: "Northwind • CI: build #4419 • 2 min ago",
  author: { name: "Atlas (release bot)", iconUrl: "https://placehold.co/24x24/png" },
  rationale: "Built from the merged PR + the existing #release-notes embed format. Color picked to match the previous Q3 release embed.",
};

export const COLOR_SWATCHES = [
  "oklch(0.74 0.13 280)",
  "oklch(0.74 0.16 145)",
  "oklch(0.78 0.16 65)",
  "oklch(0.74 0.18 25)",
  "oklch(0.74 0.13 220)",
  "oklch(0.74 0.13 320)",
  "oklch(0.66 0.13 270)",
  "oklch(0.78 0.06 80)",
];

import type { AgentMeta } from "../../types";

export type TeamsImportance = "Normal" | "Important" | "Urgent";

export type TeamsIntent = AgentMeta & {
  team: string;
  channel: string;
  message: string;
  importance: TeamsImportance;
  mentions?: string[];
};

export type TeamsPayload = {
  team: string;
  channel: string;
  message: string;
  importance: TeamsImportance;
  mentions: string[];
};

export const TEAMS_DEFAULT: TeamsIntent = {
  agent: "atlas",
  action: "post-teams",
  team: "Platform Engineering",
  channel: "Incidents",
  message: "**Auth-gateway p99 incident — RESOLVED**\n\nRoot cause: synchronous `crypto.verify` per request without public-key cache.\n\n• Fix merged in PR #4187 (cached LRU keyed by `kid`)\n• /verify p99: 880ms → 130ms\n• Postmortem: see Notion link\n\nThanks @Priya Raman and @Jonas Chen for the fast turnaround.",
  importance: "Important",
  mentions: ["@Priya Raman", "@Jonas Chen"],
  rationale: "Pulled the resolution from the merged PR + Datadog. Mentions resolved from the PR review thread.",
};

export const IMPORTANCE_COLOR: Record<TeamsImportance, { fg: string; bg: string; bd: string }> = {
  Normal:    { fg: "var(--fg-muted)", bg: "var(--bg-inset)",                                       bd: "var(--border)" },
  Important: { fg: "var(--c-warn)",   bg: "color-mix(in oklch, var(--c-warn) 14%, transparent)",   bd: "color-mix(in oklch, var(--c-warn) 30%, transparent)" },
  Urgent:    { fg: "var(--c-err)",    bg: "color-mix(in oklch, var(--c-err) 14%, transparent)",    bd: "color-mix(in oklch, var(--c-err) 30%, transparent)" },
};

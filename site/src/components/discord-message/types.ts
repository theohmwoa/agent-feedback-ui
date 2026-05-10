import type { AgentMeta } from "../../types";

export type DiscordTarget =
  | { kind: "channel"; server: string; channel: string }
  | { kind: "dm"; user: string; userHandle: string };

export type DiscordIntent = AgentMeta & {
  target: DiscordTarget;
  message: string;
  mentions?: string[];
  attachment?: { name: string; size: string };
};

export type DiscordPayload = {
  target: DiscordTarget;
  message: string;
  mentions: string[];
  attachAttachment: boolean;
};

export const DISCORD_DEFAULT: DiscordIntent = {
  agent: "atlas",
  action: "post-discord",
  target: { kind: "channel", server: "Northwind Devs", channel: "release-notes" },
  message: "v3.4.0 is out 🚀\n\n• JWT key cache (PR #4187) — p99 on /verify back to 130ms\n• Canary perf gate added to CI\n• Postmortem doc: see notion link in #incidents\n\nThanks @priya and @jchen for the hot-fix.",
  mentions: ["@priya", "@jchen"],
  attachment: { name: "release-notes-v3.4.0.md", size: "4.1 KB" },
  rationale: "Drafted from the merged PR + your last release-notes message style. Pulled mention handles from the PR review thread.",
};

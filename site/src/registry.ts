// The catalog. Adding a new component:
//   1. Drop a folder into src/components/<slug>/ with index.tsx, types.ts,
//      meta.ts, usage.ts.
//   2. Import its meta + (lazy) component below.
//   3. Add an entry to STABLE.
// Everything else (landing grid, command palette, /c/<slug> pages, install
// commands, prop tables, code samples) reads from this file.

import React from "react";
import { meta as emailMeta }  from "./components/email-compose/meta";
import { meta as slackMeta }  from "./components/slack-message/meta";
import { meta as linearMeta } from "./components/linear-issue/meta";

import { usage as emailUsage,  props as emailProps  } from "./components/email-compose/usage";
import { usage as slackUsage,  props as slackProps  } from "./components/slack-message/usage";
import { usage as linearUsage, props as linearProps } from "./components/linear-issue/usage";

// Re-export the actual components — used by the per-component preview stage.
import { EmailCompose }  from "./components/email-compose";
import { SlackMessage }  from "./components/slack-message";
import { LinearIssue }   from "./components/linear-issue";

export type ComponentStatus = "stable" | "soon";

export type ComponentMeta = {
  id: string;            // url slug: "email-compose"
  name: string;          // CLI name: "email-compose"
  title: string;         // display name: "Email compose"
  accent: string;        // CSS color (var(--c-mail) etc.)
  summary: string;
  deps?: string[];
  loc?: number;
  status: ComponentStatus;
  category?: string;
};

export type PropRow = {
  name: string;
  type: string;
  req: boolean;
  desc: string;
};

export type RegistryEntry = ComponentMeta & {
  Component?: React.ComponentType<{ onResult?: (r: unknown) => void }>;
  usage?: string;
  props?: PropRow[];
};

// Stable, shippable components.
export const STABLE: RegistryEntry[] = [
  { ...emailMeta,  Component: EmailCompose as RegistryEntry["Component"], usage: emailUsage,  props: emailProps },
  { ...slackMeta,  Component: SlackMessage as RegistryEntry["Component"], usage: slackUsage,  props: slackProps },
  { ...linearMeta, Component: LinearIssue  as RegistryEntry["Component"], usage: linearUsage, props: linearProps },
];

// Roadmap — dropped into the landing grid as "soon" cards.
export const SOON: ComponentMeta[] = [
  { id: "github-pr-review",   name: "github-pr-review",   title: "GitHub PR review",   accent: "oklch(0.78 0.06 280)", summary: "Approve, comment, or request changes on a PR diff.", status: "soon", category: "code" },
  { id: "sql-query-runner",   name: "sql-query-runner",   title: "SQL query runner",   accent: "oklch(0.74 0.10 200)", summary: "Approve a query before it hits prod. Schema awareness, dry-run preview.", status: "soon", category: "data" },
  { id: "file-patch-preview", name: "file-patch-preview", title: "File patch preview", accent: "oklch(0.78 0.10 145)", summary: "Inline diff with approve / reject / edit-in-place per hunk.", status: "soon", category: "code" },
  { id: "calendar-event",     name: "calendar-event",     title: "Calendar event",     accent: "oklch(0.74 0.12 60)",  summary: "Confirm a meeting before it's scheduled. Attendee resolution, conflict warnings.", status: "soon", category: "calendar" },
  { id: "github-issue",       name: "github-issue",       title: "GitHub issue",       accent: "oklch(0.78 0.04 280)", summary: "File a GitHub issue with labels, assignee, and milestone.", status: "soon", category: "issue-tracker" },
  { id: "sms-message",        name: "sms-message",        title: "SMS message",        accent: "oklch(0.78 0.10 320)", summary: "Approve a text message. Carrier preview, delivery window.", status: "soon", category: "messaging" },
  { id: "shell-command",      name: "shell-command",      title: "Shell command",      accent: "oklch(0.78 0.04 200)", summary: "Approve a shell command before the agent runs it. Pwd, expected effect, dry-run.", status: "soon", category: "code" },
];

// One flat list for the landing grid + command palette.
export const REGISTRY: Array<RegistryEntry | ComponentMeta> = [...STABLE, ...SOON];

export function findEntry(slug: string): RegistryEntry | ComponentMeta | undefined {
  return REGISTRY.find(r => r.id === slug);
}

export function findStable(slug: string): RegistryEntry | undefined {
  return STABLE.find(r => r.id === slug);
}

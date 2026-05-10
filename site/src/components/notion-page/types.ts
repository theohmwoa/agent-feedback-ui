import type { AgentMeta } from "../../types";

export type NotionBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "bullet"; text: string }
  | { type: "code"; lang: string; text: string }
  | { type: "todo"; text: string; done?: boolean };

export type NotionProperty = {
  name: string;
  type: "select" | "date" | "person" | "text";
  value: string;
  color?: string;
};

export type NotionIntent = AgentMeta & {
  workspace: string;
  parent: string;
  title: string;
  blocks: NotionBlock[];
  properties: NotionProperty[];
  isNew?: boolean;
};

export type NotionPayload = {
  parent: string;
  title: string;
  blocks: NotionBlock[];
  properties: NotionProperty[];
};

export const NOTION_DEFAULT: NotionIntent = {
  agent: "atlas",
  action: "update-page",
  workspace: "Nordlight",
  parent: "Engineering / Postmortems",
  title: "Auth-gateway p99 regression — May 10 deploy",
  blocks: [
    { type: "heading", level: 2, text: "What happened" },
    { type: "paragraph", text: "After the 09:14 UTC deploy, p99 latency on /verify went from 120ms to 880ms. Root cause was @nl/jwt 2.1.0 doing a synchronous crypto.verify per request without caching the public key." },
    { type: "heading", level: 2, text: "Timeline" },
    { type: "bullet", text: "09:14 — Deploy promoted to prod" },
    { type: "bullet", text: "09:31 — Datadog alert fires (p99 > 500ms threshold)" },
    { type: "bullet", text: "09:42 — Priya pulls flame graph, identifies sync verify path" },
    { type: "bullet", text: "10:08 — PR #4187 lands with module-scoped LRU" },
    { type: "bullet", text: "10:11 — Hotfix deployed; p99 returns to 130ms" },
    { type: "heading", level: 2, text: "Action items" },
    { type: "todo", text: "Add a perf regression test that fails if /verify > 200ms p99" },
    { type: "todo", text: "Document the public-key caching contract in @nl/jwt" },
    { type: "todo", text: "Add canary deploy gate that watches p99 for 10 min", done: false },
  ],
  properties: [
    { name: "Status",      type: "select", value: "Resolved",        color: "oklch(0.78 0.16 145)" },
    { name: "Severity",    type: "select", value: "P1",              color: "var(--c-warn)" },
    { name: "Owner",       type: "person", value: "Priya Raman" },
    { name: "Date",        type: "date",   value: "May 10, 2026" },
    { name: "Service",     type: "text",   value: "auth-gateway" },
  ],
  rationale: "Drafted from the Slack thread + the PR description. Pulled the timeline timestamps from Datadog and the merge log.",
};

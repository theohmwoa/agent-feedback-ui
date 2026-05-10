import type { AgentMeta } from "../../types";

export type TrelloLabel = { name: string; color: string };

export type TrelloChecklistItem = { text: string; done?: boolean };

export type TrelloCardIntent = AgentMeta & {
  board: string;
  list: string;
  title: string;
  description: string;
  labels: TrelloLabel[];
  members: { name: string }[];
  dueDate?: string;
  checklist?: TrelloChecklistItem[];
  attachments?: number;
};

export type TrelloCardPayload = {
  board: string;
  list: string;
  title: string;
  description: string;
  labels: string[];
  members: string[];
  dueDate?: string;
};

export const TRELLO_CARD_DEFAULT: TrelloCardIntent = {
  agent: "atlas",
  action: "create-card",
  board: "Q3 Platform",
  list: "Doing",
  title: "Cache JWT public keys (auth-gateway hot path)",
  description: `Module-scoped LRU keyed by kid. 32 entries, 1h TTL. PR #4187 has the patch + a regression test.

Definition of done:
- p99 < 200ms over a 5k burst
- regression test added
- canary green for 24h`,
  labels: [
    { name: "performance", color: "oklch(0.66 0.16 25)" },
    { name: "auth",        color: "oklch(0.62 0.13 240)" },
    { name: "p0",          color: "oklch(0.62 0.20 25)" },
  ],
  members: [
    { name: "Priya Raman" },
    { name: "Joaquim Chen" },
  ],
  dueDate: "Fri, May 16 · 5:00 PM",
  checklist: [
    { text: "Implement LRU cache",      done: true },
    { text: "Add regression test",      done: true },
    { text: "Land PR #4187",            done: false },
    { text: "Monitor canary 24h",       done: false },
  ],
  attachments: 1,
  rationale: "Pulled the description from your PR notes; the labels match your team's existing performance bug pattern.",
};

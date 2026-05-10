import type { AgentMeta } from "../../types";

export type MondayStatus = {
  label: string;
  color: string;
};

export type MondayColumn =
  | { kind: "status"; name: string; value: string; options: MondayStatus[] }
  | { kind: "person"; name: string; value: string }
  | { kind: "date"; name: string; value: string }
  | { kind: "number"; name: string; value: string; suffix?: string }
  | { kind: "text"; name: string; value: string };

export type MondayItemIntent = AgentMeta & {
  board: string;
  group: string;
  groupColor?: string;
  itemName: string;
  columns: MondayColumn[];
};

export type MondayItemPayload = {
  board: string;
  group: string;
  itemName: string;
  columnValues: Record<string, string>;
};

export const MONDAY_ITEM_DEFAULT: MondayItemIntent = {
  agent: "atlas",
  action: "create-monday-item",
  board: "Q3 Platform Roadmap",
  group: "In progress · this sprint",
  groupColor: "oklch(0.62 0.18 280)",
  itemName: "Cache JWT public keys (auth-gateway p99 fix)",
  columns: [
    {
      kind: "status",
      name: "Status",
      value: "Working on it",
      options: [
        { label: "Done",          color: "oklch(0.66 0.16 145)" },
        { label: "Working on it", color: "oklch(0.74 0.14 60)" },
        { label: "Stuck",         color: "oklch(0.62 0.20 25)" },
        { label: "Not started",   color: "var(--fg-faint)" },
      ],
    },
    { kind: "person", name: "Owner",    value: "Priya Raman" },
    { kind: "date",   name: "Deadline", value: "May 16" },
    { kind: "number", name: "Effort",   value: "3", suffix: "d" },
    { kind: "number", name: "Priority", value: "1" },
    { kind: "text",   name: "Service",  value: "auth-gateway" },
  ],
  rationale: "Inferred this from your sprint planning doc and the active incident; matched the column shape to your existing roadmap.",
};

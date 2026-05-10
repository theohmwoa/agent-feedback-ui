import type { AgentMeta } from "../../types";

export type ClickUpPriority = "Urgent" | "High" | "Normal" | "Low";

export type ClickUpStatus = {
  label: string;
  color: string;
};

export type ClickUpTaskIntent = AgentMeta & {
  list: string;
  space?: string;
  status: string;
  statusOptions: ClickUpStatus[];
  name: string;
  description: string;
  priority?: ClickUpPriority;
  assignees: { name: string }[];
  watchers?: { name: string }[];
  dueDate?: string;
  timeEstimate?: string;
  tags?: string[];
};

export type ClickUpTaskPayload = {
  list: string;
  status: string;
  name: string;
  description: string;
  priority?: ClickUpPriority;
  assignees: string[];
  watchers: string[];
  dueDate?: string;
  timeEstimate?: string;
};

export const CLICKUP_TASK_DEFAULT: ClickUpTaskIntent = {
  agent: "atlas",
  action: "create-clickup-task",
  list: "Platform — Q3 sprint board",
  space: "Engineering",
  status: "In progress",
  statusOptions: [
    { label: "Open",        color: "var(--fg-faint)" },
    { label: "In progress", color: "oklch(0.74 0.13 60)" },
    { label: "In review",   color: "oklch(0.66 0.16 290)" },
    { label: "Closed",      color: "oklch(0.66 0.16 145)" },
  ],
  name: "Cache JWT public keys to fix /verify p99 regression",
  description: `Module-scoped LRU keyed by kid, sized at 32 with 1h TTL. PR #4187 has the patch + a regression test.

Definition of done:
- p99 under 200ms for 24h
- regression test in CI
- canary green`,
  priority: "Urgent",
  assignees: [{ name: "Priya Raman" }, { name: "Joaquim Chen" }],
  watchers: [{ name: "Theophilus Homawoo" }],
  dueDate: "Fri, May 16",
  timeEstimate: "3d",
  tags: ["incident-followup", "auth", "p0"],
  rationale: "Pulled the assignees from the PR you reviewed yesterday; matched the priority to the active incident severity.",
};

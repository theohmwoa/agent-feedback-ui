import type { AgentMeta } from "../../types";

export type AsanaPriority = "Low" | "Medium" | "High";

export type AsanaCustomField = {
  name: string;
  value: string;
  color?: string;
};

export type AsanaTaskIntent = AgentMeta & {
  project: string;
  section: string;
  title: string;
  description: string;
  dueDate?: string;
  assignee: { name: string; email?: string };
  priority?: AsanaPriority;
  dependencies?: number;
  customFields?: AsanaCustomField[];
  tags?: string[];
};

export type AsanaTaskPayload = {
  project: string;
  section: string;
  title: string;
  description: string;
  dueDate?: string;
  assignee: string;
  priority?: AsanaPriority;
  customFields?: Record<string, string>;
};

export const ASANA_TASK_DEFAULT: AsanaTaskIntent = {
  agent: "atlas",
  action: "create-asana-task",
  project: "Q3 — Platform Reliability",
  section: "Active sprint",
  title: "Land JWT public-key cache and verify p99 recovery",
  description: `Cache the resolved public key in module scope, keyed by kid. Sized for our key rotation cadence (32 entries, 1h TTL).

Acceptance:
• /verify p99 < 200ms over a 5k-request burst
• Regression test added that fails if it regresses
• Perf canary green for 24h before closing`,
  dueDate: "Fri, May 16",
  assignee: { name: "Priya Raman", email: "priya.raman@nordlight.studio" },
  priority: "High",
  dependencies: 2,
  customFields: [
    { name: "Service",     value: "auth-gateway", color: "oklch(0.66 0.16 25)" },
    { name: "Effort",      value: "3 days",       color: "oklch(0.74 0.13 60)" },
    { name: "Risk",        value: "Medium",       color: "oklch(0.78 0.15 75)" },
    { name: "Reviewer",    value: "Joaquim Chen", color: "oklch(0.66 0.13 240)" },
  ],
  tags: ["incident-followup", "performance"],
  rationale: "Tied to the active incident in #eng-platform; this is the followup. Pulled the deadline from the postmortem owner field.",
};

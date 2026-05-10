import type { AgentMeta } from "../../types";

export type N8nMode = "manual" | "webhook-test" | "production";

export type N8nNode = {
  name: string;
  short: string;
};

export type N8nIntent = AgentMeta & {
  workflowName: string;
  workflowId: string;
  nodes: N8nNode[];
  inputJson: string;
  mode: N8nMode;
  pinnedData?: boolean;
  isActive?: boolean;
};

export type N8nPayload = {
  workflowId: string;
  mode: N8nMode;
  input: string;
  pinnedData: boolean;
};

export const N8N_DEFAULT: N8nIntent = {
  agent: "atlas",
  action: "n8n-run",
  workflowName: "Sync Linear → Slack daily standup",
  workflowId: "Wf-2837",
  nodes: [
    { name: "Cron",          short: "C" },
    { name: "Linear",        short: "L" },
    { name: "Function",      short: "f()" },
    { name: "OpenAI",        short: "AI" },
    { name: "Slack",         short: "Sl" },
  ],
  inputJson: `{
  "team_id": "PLAT",
  "since": "2026-05-09T00:00:00Z",
  "channel": "#eng-standup",
  "include_completed": true
}`,
  mode: "production",
  pinnedData: false,
  isActive: true,
  rationale: "Standup digest is overdue — the cron node didn't fire because of yesterday's webhook outage. Running it manually with today's window.",
};

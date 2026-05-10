import type { AgentMeta } from "../../types";

export type PdUrgency = "low" | "high";
export type PdPostAction = "none" | "open-slack" | "run-runbook";

export type PdIntent = AgentMeta & {
  incidentNumber: string;
  title: string;
  urgency: PdUrgency;
  service: string;
  alertsCount: number;
  triggeredAt: string;
  oncallName: string;
  oncallEscalation?: string;
  defaultEtaMins?: number;
  defaultPostAction?: PdPostAction;
  runbookName?: string;
  slackChannel?: string;
};

export type PdPayload = {
  incidentNumber: string;
  etaMins: number;
  snoozeMins: number;
  postAction: PdPostAction;
};

export const PD_DEFAULT: PdIntent = {
  agent: "atlas",
  action: "ack-incident",
  incidentNumber: "PD-Q5J2X4",
  title: "auth-gateway p99 over 800ms · sustained 4m",
  urgency: "high",
  service: "auth-gateway",
  alertsCount: 7,
  triggeredAt: "11:38 PT · 6 min ago",
  oncallName: "Priya Raman",
  oncallEscalation: "secondary: Marco Chen",
  defaultEtaMins: 15,
  defaultPostAction: "open-slack",
  runbookName: "auth-gateway / latency-spike.md",
  slackChannel: "#incident-q5j2x4",
  rationale: "Page fired 6 min ago. You're primary oncall; Datadog tags match the kid-cache regression you patched yesterday.",
};

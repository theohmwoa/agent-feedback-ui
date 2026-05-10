import type { ComponentMeta } from "../../registry";

export const meta: ComponentMeta = {
  id: "pagerduty-incident-ack",
  name: "pagerduty-incident-ack",
  title: "PagerDuty incident ack",
  accent: "oklch(0.66 0.18 145)",
  summary: "Acknowledge an incident, set ETA, snooze re-page, pick a follow-up action (open Slack, run runbook).",
  loc: 280,
  status: "stable",
  category: "observability",
};

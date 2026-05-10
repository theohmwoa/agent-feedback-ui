import type { AgentMeta } from "../../types";

export type ZendeskStatus = "open" | "pending" | "solved" | "closed";

export type ZendeskIntent = AgentMeta & {
  ticketNumber: number;
  subject: string;
  requester: { name: string; email: string };
  organization?: string;
  priority: "Low" | "Normal" | "High" | "Urgent";
  reply: string;
  isInternal?: boolean;
  newStatus?: ZendeskStatus;
};

export type ZendeskPayload = {
  ticketNumber: number;
  reply: string;
  isInternal: boolean;
  newStatus: ZendeskStatus;
};

export const ZENDESK_DEFAULT: ZendeskIntent = {
  agent: "atlas",
  action: "reply-ticket",
  ticketNumber: 88421,
  subject: "Webhook deliveries failing for events.created with 504",
  requester: { name: "Marisol Vega", email: "marisol@northstar-agency.com" },
  organization: "Northstar Agency",
  priority: "High",
  reply: "Hi Marisol — thanks for the trace. We identified the issue: a downstream verification step was timing out on a cold start. We deployed a fix to bump the timeout to 30s and added retries with backoff. You should see deliveries succeed again from 14:20 UTC onward. Could you confirm and let me know if any payloads are still missing?",
  isInternal: false,
  newStatus: "pending",
  rationale: "Pulled the 504 trace from her Zendesk thread + the related fix in PR #2104. Status moves to pending pending her confirmation.",
};

export const STATUS_COLOR: Record<ZendeskStatus, string> = {
  open:    "oklch(0.74 0.18 25)",
  pending: "oklch(0.78 0.16 65)",
  solved:  "oklch(0.78 0.16 145)",
  closed:  "var(--fg-faint)",
};

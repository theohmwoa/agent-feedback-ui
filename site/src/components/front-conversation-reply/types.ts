import type { AgentMeta } from "../../types";

export type FrontChannel = "email" | "sms" | "chat" | "twitter";

export type FrontIntent = AgentMeta & {
  conversationId: string;
  channel: FrontChannel;
  subject?: string;
  recipients: string[];
  reply: string;
  assignee?: string;
  tags: string[];
  snooze?: string;
};

export type FrontPayload = {
  conversationId: string;
  reply: string;
  assignee?: string;
  tags: string[];
  snooze?: string;
};

export const FRONT_DEFAULT: FrontIntent = {
  agent: "atlas",
  action: "reply-conversation",
  conversationId: "cnv_8a4f1c",
  channel: "email",
  subject: "Re: Refund for duplicate charge — invoice #INV-2249",
  recipients: ["billing@northwind.dev", "ops-team@front.app"],
  reply: "Hey team — confirmed with Stripe: the duplicate charge on INV-2249 was caused by the retry storm during the May 6 webhook outage. I've issued a $49.00 refund (re_3OqB9X). It should clear within 5–10 business days. Looping in @soraya for the customer-facing email.",
  assignee: "Soraya Khaled",
  tags: ["billing", "stripe", "refund"],
  rationale: "Pulled from the linked Stripe event + the May 6 webhook incident timeline. Tags inferred from the conversation history.",
};

export const ASSIGNEES = ["Soraya Khaled", "Marisol Vega", "Theo Homawoo", "unassigned"];

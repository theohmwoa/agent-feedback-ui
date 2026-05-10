import type { AgentMeta } from "../../types";

export type IntercomCustomer = {
  name: string;
  email: string;
  plan: string;
  lastSeen: string;
};

export type IntercomIntent = AgentMeta & {
  customer: IntercomCustomer;
  conversationId: string;
  priorMessage: { author: string; text: string; time: string };
  reply: string;
  internalNote?: boolean;
};

export type IntercomPayload = {
  conversationId: string;
  reply: string;
  internalNote: boolean;
  closeAfter: boolean;
  snooze?: string;
};

export const INTERCOM_DEFAULT: IntercomIntent = {
  agent: "atlas",
  action: "reply-conversation",
  customer: {
    name: "Soraya Khaled",
    email: "soraya.k@harbor-labs.io",
    plan: "Pro · seat 3 of 10",
    lastSeen: "online · 3 min ago",
  },
  conversationId: "57291",
  priorMessage: {
    author: "Soraya Khaled",
    text: "Hey — getting a 502 when I upload images larger than 8MB. Is there a way to bump the limit on the Pro plan? Trying to onboard a new team next week.",
    time: "11:47 AM",
  },
  reply: "Hey Soraya — sorry about that! The 8MB cap is a config we can lift on your workspace. I just bumped it to 32MB for you (no plan change needed). Try the upload again and let me know if you hit it.",
  internalNote: false,
  rationale: "Pulled from her conversation thread + the 502 being traced to the upload-size middleware. Tone matched to your last reply on this account.",
};

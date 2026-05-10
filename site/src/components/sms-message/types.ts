import type { AgentMeta } from "../../types";

export type SmsIntent = AgentMeta & {
  to: string;
  toName?: string;
  message: string;
  carrier?: string;
  costEstimate?: string;
  scheduleAt?: string;
};

export type SmsPayload = {
  to: string;
  message: string;
  scheduleAt?: string;
};

export const SMS_DEFAULT: SmsIntent = {
  agent: "atlas",
  action: "send-sms",
  to: "+1 (415) 555-0148",
  toName: "Maya Okafor",
  message: "Hey Maya — running 5 min behind for the call. Hop on whenever you're free, no rush.",
  carrier: "Verizon",
  costEstimate: "$0.0079",
  rationale: "Detected the calendar invite is starting in 4 minutes; you haven't joined the room yet.",
};

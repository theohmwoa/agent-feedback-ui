import type { AgentMeta } from "../../types";

export type ViberIntent = AgentMeta & {
  to: string;
  toName?: string;
  message: string;
  recipientOnViber: boolean;
  viberOutCost?: string;
};

export type ViberPayload = {
  to: string;
  message: string;
  viaViberOut: boolean;
};

export const VIBER_DEFAULT: ViberIntent = {
  agent: "atlas",
  action: "send-viber",
  to: "+359 88 555 0142",
  toName: "Stoyan Petrov",
  message: "Hi Stoyan — sending the revised contract draft over now. Quick walkthrough Friday 14:00 Sofia time?",
  recipientOnViber: false,
  viberOutCost: "$0.022 / min · €0.018 / SMS",
  rationale: "Recipient is not on Viber — message will be billed via Viber Out at carrier rates.",
};

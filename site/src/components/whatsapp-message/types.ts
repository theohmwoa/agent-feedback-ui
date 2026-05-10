import type { AgentMeta } from "../../types";

export type WhatsappIntent = AgentMeta & {
  to: string;
  toName?: string;
  message: string;
  templateName?: string;
};

export type WhatsappPayload = {
  to: string;
  message: string;
};

export const WHATSAPP_DEFAULT: WhatsappIntent = {
  agent: "atlas",
  action: "send-whatsapp",
  to: "+44 7700 900181",
  toName: "Imani Brooks",
  message: "Hey Imani — quick heads-up: we shipped the cache fix for the verify endpoint. p99 is back to 130ms. I'll send the postmortem doc Monday. Have a good weekend 🌱",
  templateName: "ops_status_update",
  rationale: "Continuing your earlier WhatsApp thread with Imani about the auth-gateway p99 spike. Tone matched to your last reply.",
};

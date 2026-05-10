import type { AgentMeta } from "../../types";

export type EmailIntent = AgentMeta & {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  tone?: "warm" | "neutral" | "terse";
};

export type EmailPayload = {
  to: string[];
  cc: string[];
  subject: string;
  body: string;
};

export const EMAIL_DEFAULT: EmailIntent = {
  agent: "atlas",
  action: "send-email",
  to: ["maya.okafor@nordlight.studio"],
  cc: [],
  subject: "Re: Q3 partnership terms",
  body: `Hi Maya,

Quick follow-up on the partnership terms we discussed Tuesday. I've folded in the revised licensing window (24 months) and the joint-attribution clause from your last redline.

Two open items I wanted your sign-off on before we send this to legal:

  1. Royalty split on derivative work — currently 60/40, your team proposed 55/45.
  2. Termination notice — we have it at 90 days; happy to come down to 60 if that's a deal-breaker.

I can hop on a call Thursday afternoon if it's easier to talk through these.

Best,
Theo`,
  tone: "warm",
  rationale: "Replied to the most recent thread in your inbox where Maya asked for an updated draft. Tone matched to your prior reply.",
};

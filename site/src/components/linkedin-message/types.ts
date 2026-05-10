import type { AgentMeta } from "../../types";

export type LinkedInMessageIntent = AgentMeta & {
  recipient: {
    name: string;
    headline: string;
    company?: string;
    inNetwork?: boolean;
    online?: boolean;
  };
  priorMessage?: { author: "them" | "you"; text: string; time: string };
  message: string;
  isInMail?: boolean;
};

export type LinkedInMessagePayload = {
  recipientName: string;
  message: string;
  isInMail: boolean;
};

export const LINKEDIN_MESSAGE_DEFAULT: LinkedInMessageIntent = {
  agent: "atlas",
  action: "send-linkedin-message",
  recipient: {
    name: "Rubén Sánchez",
    headline: "Engineering Manager · Windmill",
    company: "Windmill",
    inNetwork: false,
    online: false,
  },
  priorMessage: undefined,
  message: `Hi Rubén — I shipped an open-source library this week that I think overlaps with what you're doing at Windmill. Quick read, would love your feedback if you have time.

agent-ui · 13 review/edit components for AI agent action surfaces (email, slack, PR review, SQL runner…). MIT, copy-paste registry à la shadcn.

→ https://github.com/theohmwoa/agent-feedback-ui

No pressure, just thought you'd find it interesting.`,
  isInMail: true,
  rationale: "Rubén isn't in your network; this would be an InMail. Drafted from your earlier search on people working on similar agent-infra. Tone matched to your prior outbound DMs.",
};

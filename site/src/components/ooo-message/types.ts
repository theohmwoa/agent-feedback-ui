import type { AgentMeta } from "../../types";

export type OooScope = "everyone" | "contacts" | "external";

export type OooIntent = AgentMeta & {
  startsAt: string;
  endsAt: string;
  subject: string;
  body: string;
  scope?: OooScope;
  urgentPager?: string;
};

export type OooPayload = {
  startsAt: string;
  endsAt: string;
  subject: string;
  body: string;
  scope: OooScope;
  urgentPager?: string;
};

export const OOO_DEFAULT: OooIntent = {
  agent: "atlas",
  action: "set-ooo",
  startsAt: "Mon, May 26 · 9:00 AM",
  endsAt:   "Mon, June 2 · 9:00 AM",
  subject: "Out of office — back June 2",
  body: `Hi {first_name},

Thanks for your message. I'm out of office through June 1 and will respond when I'm back at my desk on June 2.

If this is urgent and time-sensitive, please reach out to {urgent_pager} — they'll route it to whoever is on-call.

Thanks for your patience,
Theo`,
  scope: "everyone",
  urgentPager: "ops@nordlight.studio",
  rationale: "Drafted from your calendar block (May 26 → June 2) labeled \"PTO — Lisbon\". Tone matched to your prior OOO replies.",
};

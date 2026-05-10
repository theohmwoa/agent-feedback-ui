import type { AgentMeta } from "../../types";

export type SignalTimer = "off" | "30s" | "5m" | "1h" | "1d" | "1w";

export type SignalIntent = AgentMeta & {
  to: string;
  toName?: string;
  toHandle?: string;
  message: string;
  disappearingTimer?: SignalTimer;
  hasAttachment?: boolean;
};

export type SignalPayload = {
  to: string;
  message: string;
  disappearingTimer: SignalTimer;
};

export const SIGNAL_DEFAULT: SignalIntent = {
  agent: "atlas",
  action: "send-signal",
  to: "+1 (415) 555-0142",
  toName: "Priya Raman",
  toHandle: "@priya.42",
  message: "Hey — quick heads-up the on-call rotation pages got swapped for next week. You're now Tue/Thu instead of Mon/Wed. Calendar should reflect it in ~5min.",
  disappearingTimer: "1d",
  hasAttachment: false,
  rationale: "Detected the on-call rotation change in PagerDuty 2 minutes ago — Priya was the previous primary for the swapped slots.",
};

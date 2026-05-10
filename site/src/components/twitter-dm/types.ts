import type { AgentMeta } from "../../types";

export type TwitterDmIntent = AgentMeta & {
  recipient: { handle: string; displayName: string; verified?: boolean; followsYou?: boolean };
  priorMessage?: { author: "them" | "you"; text: string; time: string };
  message: string;
};

export type TwitterDmPayload = {
  recipientHandle: string;
  message: string;
};

export const TWITTER_DM_DEFAULT: TwitterDmIntent = {
  agent: "atlas",
  action: "send-dm",
  recipient: {
    handle: "@priyaraman",
    displayName: "Priya Raman",
    verified: true,
    followsYou: false,
  },
  priorMessage: {
    author: "them",
    time: "yesterday",
    text: "saw the postmortem — clean fix. did you write the regression test in the same PR or a follow-up?",
  },
  message: "Same PR — wired into the existing perf-canary suite so it'll fail the gate if /verify p99 climbs back over 200ms. Happy to walk you through the harness if useful.",
  rationale: "Priya asked a direct question yesterday and you haven't replied. Drafted from the regression-test PR you opened this morning.",
};

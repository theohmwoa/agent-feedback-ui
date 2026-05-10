import type { AgentMeta } from "../../types";

export type SlackIntent = AgentMeta & {
  workspace: string;
  channel: string;
  thread?: {
    parent: { author: string; time: string; text: string };
    replies: number;
  };
  mentions?: string[];
  message: string;
};

export type SlackPayload = {
  channel: string;
  message: string;
  broadcast: boolean;
};

export const SLACK_DEFAULT: SlackIntent = {
  agent: "atlas",
  action: "post-message",
  workspace: "nordlight",
  channel: "eng-platform",
  thread: {
    parent: {
      author: "Priya Raman",
      time: "11:42",
      text: "Heads up — the auth gateway p99 is back over 800ms since the deploy this morning. Tracing it now.",
    },
    replies: 4,
  },
  mentions: ["@priya", "@on-call"],
  message: "Pulled the flame graph — looks like the new JWT library is doing a synchronous `crypto.verify` per request instead of caching the public key. Patch ready in #4187, can someone with merge rights take a look?",
  rationale: "Detected an unresolved p99 latency thread you were tagged on. Drafted a reply with the root-cause analysis from your local profiling run.",
};

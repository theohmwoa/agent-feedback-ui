import type { AgentMeta } from "../../types";

export type JiraComment = {
  author: string;
  time: string;
  body: string;
  internal?: boolean;
};

export type JiraCommentIntent = AgentMeta & {
  issue: {
    key: string;
    summary: string;
    status: string;
    type?: string;
    priority?: string;
  };
  priorComments: JiraComment[];
  body: string;
  mentions?: string[];
  internal?: boolean;
};

export type JiraCommentPayload = {
  issueKey: string;
  body: string;
  mentions: string[];
  internal: boolean;
};

export const JIRA_COMMENT_DEFAULT: JiraCommentIntent = {
  agent: "atlas",
  action: "add-comment",
  issue: {
    key: "PLAT-241",
    summary: "Auth gateway hot-path: synchronous JWT verify blocks event loop",
    status: "In Progress",
    type: "Bug",
    priority: "Highest",
  },
  priorComments: [
    {
      author: "Priya Raman",
      time: "11:42 today",
      body: "Pulled the flame graph — it's clearly the synchronous verify. Patch incoming in #4187. Should be ready for review in ~30 min.",
    },
    {
      author: "Joaquim Chen",
      time: "12:08 today",
      body: "Reviewed locally. The LRU sizing (32 keys) seems right for our rotation cadence. +1 to merging once CI is green.",
    },
  ],
  body: "Confirmed via load test — p99 dropped from 880ms back to 130ms after the cache landed. Closing this out tomorrow once we see 24h of stable metrics.",
  mentions: ["@priya", "@joaquim"],
  internal: false,
  rationale: "Saw the PR merged + the Datadog dashboard recovered. Drafted the closing comment using your usual phrasing.",
};

import type { AgentMeta } from "../../types";

export type BbReviewKind = "approve" | "needs_work" | "comment";

export type BbBuild = {
  name: string;
  status: "successful" | "failed" | "in_progress" | "stopped";
  url?: string;
};

export type BbPrIntent = AgentMeta & {
  workspace: string;
  repo: string;
  number: number;
  title: string;
  author: string;
  sourceBranch: string;
  destinationBranch: string;
  filesChanged: number;
  added: number;
  deleted: number;
  builds: BbBuild[];
  description: string;
  reviewers?: string[];
  draftReviewKind?: BbReviewKind;
  draftBody?: string;
};

export type BbPrPayload = {
  workspace: string;
  repo: string;
  number: number;
  kind: BbReviewKind;
  body: string;
};

export const BITBUCKET_PR_DEFAULT: BbPrIntent = {
  agent: "atlas",
  action: "review-pr",
  workspace: "northwind",
  repo: "billing-svc",
  number: 612,
  title: "fix(stripe): retry idempotency keys on 409",
  author: "rafael.silva",
  sourceBranch: "fix/stripe-409-retry",
  destinationBranch: "main",
  filesChanged: 4,
  added: 78,
  deleted: 14,
  builds: [
    { name: "PIPELINE — build",    status: "successful" },
    { name: "PIPELINE — unit",     status: "successful" },
    { name: "PIPELINE — contract", status: "successful" },
    { name: "Bitbucket Pipelines", status: "in_progress" },
  ],
  description: `Stripe started returning 409 on duplicate idempotency keys after their May rollout. We were treating those as failures and rolling back the local invoice — this lifts a successful retry into the success path and adds a contract test against their fixture server.`,
  reviewers: ["maya.okafor", "ji.park"],
  draftReviewKind: "approve",
  draftBody: "Approve. The idempotency-key handling matches Stripe's updated guidance. Nice contract test — that should catch the next behavior change.",
  rationale: "Cross-checked the change against Stripe's API changelog (2026-04-28). Logic and contract test align; nothing else upstream changed.",
};

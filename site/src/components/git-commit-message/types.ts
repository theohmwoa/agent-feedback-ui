import type { AgentMeta } from "../../types";

export type CommitType =
  | "feat" | "fix" | "docs" | "refactor" | "perf"
  | "test" | "chore" | "build" | "ci" | "style" | "revert";

export type CommitFile = {
  path: string;
  added: number;
  deleted: number;
  status: "modified" | "added" | "deleted" | "renamed";
};

export type CommitIntent = AgentMeta & {
  branch: string;
  authorName: string;
  authorEmail: string;
  files: CommitFile[];
  type: CommitType;
  scope?: string;
  subject: string;
  body?: string;
  amend?: boolean;
  signoff?: boolean;
};

export type CommitPayload = {
  message: string;
  amend: boolean;
  signoff: boolean;
};

export const COMMIT_DEFAULT: CommitIntent = {
  agent: "atlas",
  action: "git-commit",
  branch: "feat/billing-retries",
  authorName: "Theo Homawoo",
  authorEmail: "theo@northwind.dev",
  files: [
    { path: "src/billing/stripe.ts",            added: 38, deleted: 6,  status: "modified" },
    { path: "src/billing/retry.ts",             added: 22, deleted: 0,  status: "added" },
    { path: "test/billing/stripe.test.ts",      added: 14, deleted: 2,  status: "modified" },
    { path: "test/fixtures/stripe-409.json",    added: 18, deleted: 0,  status: "added" },
  ],
  type: "fix",
  scope: "stripe",
  subject: "retry idempotency keys on 409",
  body: `Stripe started returning 409 on duplicate idempotency keys after their May rollout.\nWe were treating those as failures and rolling back the local invoice.\nThis lifts a successful retry into the success path and adds a contract test.`,
  amend: false,
  signoff: true,
  rationale: "Pulled the type/scope from the staged diff and the subject from the related Linear ticket.",
};

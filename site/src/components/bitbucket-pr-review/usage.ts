export const usage = `import { BitbucketPrReview } from "@/components/agent-ui/bitbucket-pr-review";

<BitbucketPrReview
  intent={{
    workspace: "northwind",
    repo: "billing-svc",
    number: 612,
    title: prTitle,
    author: "rafael.silva",
    sourceBranch: "fix/stripe-409-retry",
    destinationBranch: "main",
    filesChanged: 4,
    added: 78,
    deleted: 14,
    builds: builds,         // [{ name, status: "successful" | "failed" | "in_progress" | "stopped" }]
    description: agentSummary,
    reviewers: ["maya.okafor"],
    draftReviewKind: "approve",
    draftBody: agentBody,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      bitbucket.pullrequests.create_comment(r.payload.number, r.payload.body);
      if (r.payload.kind === "approve")    bitbucket.pullrequests.approve(r.payload.number);
      if (r.payload.kind === "needs_work") bitbucket.pullrequests.request_changes(r.payload.number);
    }
  }}
/>`;

export const props = [
  { name: "intent",          type: "BbPrIntent",                            req: true,  desc: "Workspace, repo, PR number, branches, diff stats, builds, description, draft review." },
  { name: "onResult",        type: "(r: ReviewResult<BbPrPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "draftReviewKind", type: "'approve' | 'needs_work' | 'comment'",  req: false, desc: "Pre-selected review state. User can flip with the segmented control." },
];

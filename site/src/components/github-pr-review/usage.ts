export const usage = `import { GithubPrReview } from "@/components/agent-ui/github-pr-review";

<GithubPrReview
  intent={{
    repo: "nordlight/api-gateway",
    number: 4187,
    title: prTitle,
    author: "priyaraman",
    branch: "fix/jwt-key-cache",
    baseBranch: "main",
    filesChanged: 3,
    added: 42,
    deleted: 6,
    checks: ciChecks,                  // [{ name, status: "ok" | "fail" | "pending" }]
    summary: agentSummary,
    draftReviewKind: "approve",
    draftBody: agentBody,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      octokit.pulls.createReview({
        owner, repo,
        pull_number: r.payload.number,
        event: r.payload.kind === "request_changes" ? "REQUEST_CHANGES"
             : r.payload.kind === "approve"         ? "APPROVE"
             :                                        "COMMENT",
        body: r.payload.body,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "PrIntent",                            req: true,  desc: "Repo, number, title, author, branches, diff stats, checks, agent summary + draft review." },
  { name: "onResult", type: "(r: ReviewResult<PrReviewPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "draftReviewKind", type: "'approve' | 'comment' | 'request_changes'", req: false, desc: "Pre-selected review state. User can flip with the segmented control." },
];

export const usage = `import { GitlabMrReview } from "@/components/agent-ui/gitlab-mr-review";

<GitlabMrReview
  intent={{
    project: "infra/edge-router",
    number: 218,
    title: mrTitle,
    author: "lin.huang",
    sourceBranch: "lin/geo-routing",
    targetBranch: "main",
    filesChanged: 7,
    added: 184,
    deleted: 22,
    pipeline: pipeline,           // [{ name, status: "passed" | "failed" | "running" | "manual", duration? }]
    pipelineId: 99412,
    description: agentSummary,
    draftReviewKind: "approve",
    draftBody: agentBody,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      gitlab.MergeRequestNotes.create(projectId, r.payload.number, r.payload.body);
      if (r.payload.kind === "approve") gitlab.MergeRequestApprovals.approve(projectId, r.payload.number);
      if (r.payload.kind === "block")   gitlab.MergeRequests.edit(projectId, r.payload.number, { discussion_locked: true });
    }
  }}
/>`;

export const props = [
  { name: "intent",          type: "GlMrIntent",                            req: true,  desc: "Project, MR number, branches, diff stats, pipeline list, description, draft review." },
  { name: "onResult",        type: "(r: ReviewResult<GlMrPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "draftReviewKind", type: "'approve' | 'comment' | 'block'",       req: false, desc: "Pre-selected review state. User can flip with the segmented control." },
];

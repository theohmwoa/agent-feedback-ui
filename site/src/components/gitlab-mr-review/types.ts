import type { AgentMeta } from "../../types";

export type GlReviewKind = "approve" | "comment" | "block";

export type GlPipelineCheck = {
  name: string;
  status: "passed" | "failed" | "running" | "manual";
  duration?: string;
};

export type GlMrIntent = AgentMeta & {
  project: string;
  number: number;
  title: string;
  author: string;
  sourceBranch: string;
  targetBranch: string;
  filesChanged: number;
  added: number;
  deleted: number;
  pipeline: GlPipelineCheck[];
  pipelineId?: number;
  description: string;
  draftReviewKind?: GlReviewKind;
  draftBody?: string;
};

export type GlMrPayload = {
  project: string;
  number: number;
  kind: GlReviewKind;
  body: string;
};

export const GITLAB_MR_DEFAULT: GlMrIntent = {
  agent: "atlas",
  action: "review-mr",
  project: "infra/edge-router",
  number: 218,
  title: "feat(router): add geo-aware origin selection for ap-southeast-1",
  author: "lin.huang",
  sourceBranch: "lin/geo-routing",
  targetBranch: "main",
  filesChanged: 7,
  added: 184,
  deleted: 22,
  pipelineId: 99412,
  pipeline: [
    { name: "lint",         status: "passed",  duration: "0:42" },
    { name: "test:unit",    status: "passed",  duration: "2:11" },
    { name: "test:e2e",     status: "passed",  duration: "5:38" },
    { name: "build:image",  status: "passed",  duration: "3:04" },
    { name: "deploy:staging", status: "manual" },
  ],
  description: `Routes APAC traffic through the new sg1 PoP using a geo-IP lookup at the edge. Falls back to the Singapore CDN if the lookup misses. Adds a feature flag (\`router.geo_routing\`) so we can ramp gradually.`,
  draftReviewKind: "approve",
  draftBody: "Approval. The fallback path is what I would have asked for. One nit: consider logging the geo-IP miss reason so we can tune the lookup table — happy to follow up.",
  rationale: "Fits the migration plan in the linked epic. Pipeline green, e2e covers the fallback, no risky regex around IPv6.",
};

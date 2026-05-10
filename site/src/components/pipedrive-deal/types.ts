import type { AgentMeta } from "../../types";

export type PipedriveStage = {
  id: number;
  name: string;
};

export type PipedrivePipeline = {
  id: number;
  name: string;
  stages: PipedriveStage[];
};

export type PipedriveLabel = {
  id: number;
  name: string;
  color: string;
};

export type PipedriveDealIntent = AgentMeta & {
  mode: "create" | "move";
  title: string;
  valueCents: number;
  currency: string;
  pipelines: PipedrivePipeline[];
  pipelineId: number;
  stageId: number;
  expectedCloseDate: string;
  person: { id: number; name: string };
  organization: { id: number; name: string };
  owner: { name: string; email: string };
  labels: PipedriveLabel[];
  availableLabels?: PipedriveLabel[];
};

export type PipedriveDealPayload = {
  mode: "create" | "move";
  title: string;
  valueCents: number;
  currency: string;
  pipelineId: number;
  stageId: number;
  expectedCloseDate: string;
  personId: number;
  organizationId: number;
  labelIds: number[];
};

export const PIPEDRIVE_DEFAULT: PipedriveDealIntent = {
  agent: "atlas",
  action: "move-deal",
  mode: "move",
  title: "Halcyon Robotics — annual subscription",
  valueCents: 1842000,
  currency: "USD",
  pipelines: [
    {
      id: 1,
      name: "Standard pipeline",
      stages: [
        { id: 11, name: "Lead in" },
        { id: 12, name: "Contact made" },
        { id: 13, name: "Demo scheduled" },
        { id: 14, name: "Proposal made" },
        { id: 15, name: "Negotiations started" },
      ],
    },
    {
      id: 2,
      name: "Enterprise pipeline",
      stages: [
        { id: 21, name: "Discovery" },
        { id: 22, name: "Technical review" },
        { id: 23, name: "Procurement" },
        { id: 24, name: "Legal" },
      ],
    },
  ],
  pipelineId: 1,
  stageId: 14,
  expectedCloseDate: "2026-06-15",
  person: { id: 4012, name: "Yuki Tanaka" },
  organization: { id: 891, name: "Halcyon Robotics" },
  owner: { name: "Theophilus Homawoo", email: "theo@nordlight.com" },
  labels: [
    { id: 1, name: "Hot",          color: "oklch(0.68 0.18 25)" },
    { id: 2, name: "Q3 commit",    color: "oklch(0.74 0.14 60)" },
  ],
  availableLabels: [
    { id: 3, name: "Renewal",      color: "oklch(0.74 0.14 165)" },
    { id: 4, name: "Strategic",    color: "oklch(0.70 0.13 280)" },
    { id: 5, name: "Champion req", color: "oklch(0.78 0.10 320)" },
  ],
  rationale: "Yuki sent the redlined proposal back this morning with a counter on the seat-tier. Moving the deal to Proposal made and bumping the value to match the counter ($18.4k).",
};

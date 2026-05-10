import type { AgentMeta } from "../../types";

export type SegmentDestination = {
  id: string;
  name: string;
  color: string;
  enabled: boolean;
};

export type SegmentIntent = AgentMeta & {
  workspace: string;
  source: string;
  event: string;
  knownEvents?: string[];
  userId?: string;
  anonymousId?: string;
  properties: string;
  destinations: SegmentDestination[];
};

export type SegmentPayload = {
  source: string;
  event: string;
  userId?: string;
  anonymousId?: string;
  properties: string;
  integrations: Record<string, boolean>;
};

export const SEGMENT_DEFAULT: SegmentIntent = {
  agent: "atlas",
  action: "segment-track",
  workspace: "nordlight",
  source: "web-app",
  event: "Onboarding Step Completed",
  knownEvents: [
    "Onboarding Step Completed",
    "Onboarding Completed",
    "Workspace Created",
    "Plan Upgraded",
    "Invite Sent",
    "Trial Started",
    "Account Deleted",
  ],
  userId: "u_84bf2e91",
  anonymousId: "anon-d3dc1a2b",
  properties: `{
  "step": "billing_added",
  "step_index": 4,
  "total_steps": 5,
  "plan": "Team",
  "trial_remaining_days": 12
}`,
  destinations: [
    { id: "mixpanel",     name: "Mixpanel",     color: "oklch(0.74 0.16 280)", enabled: true  },
    { id: "amplitude",    name: "Amplitude",    color: "oklch(0.66 0.18 280)", enabled: true  },
    { id: "customerio",   name: "Customer.io",  color: "oklch(0.66 0.18 30)",  enabled: false },
    { id: "warehouse",    name: "BigQuery",     color: "oklch(0.74 0.13 240)", enabled: true  },
  ],
  rationale: "User just confirmed billing on the trial — pushing the onboarding step event so the lifecycle email queue can pick them up.",
};

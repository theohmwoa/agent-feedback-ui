import type { AgentMeta } from "../../types";

export type VercelEnv = "preview" | "production";

export type VercelEnvVar = {
  key: string;
  value: string;
  status?: "added" | "changed" | "unchanged";
};

export type VercelIntent = AgentMeta & {
  project: string;
  org?: string;
  target: VercelEnv;
  branch: string;
  commit: string;
  commitMessage?: string;
  envVars?: VercelEnvVar[];
  regions?: string[];
  promoteToProduction?: boolean;
};

export type VercelPayload = {
  project: string;
  target: VercelEnv;
  commit: string;
  envVars: VercelEnvVar[];
  regions: string[];
  promoteToProduction: boolean;
};

export const VERCEL_DEFAULT: VercelIntent = {
  agent: "atlas",
  action: "deploy",
  project: "nordlight-marketing",
  org: "nordlight",
  target: "preview",
  branch: "feat/pricing-page-v2",
  commit: "8a3f1d2",
  commitMessage: "feat(pricing): refresh pricing page with new tiers",
  envVars: [
    { key: "STRIPE_PUBLIC_KEY", value: "pk_live_***", status: "unchanged" },
    { key: "ANALYTICS_TOKEN", value: "amp_***", status: "changed" },
    { key: "FEATURE_NEW_PRICING", value: "true", status: "added" },
  ],
  regions: ["iad1", "sfo1", "fra1"],
  promoteToProduction: false,
  rationale: "Pushing the new pricing page to a preview URL so the team can review before promoting. Includes the new FEATURE_NEW_PRICING flag.",
};

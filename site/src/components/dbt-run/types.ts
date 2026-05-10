import type { AgentMeta } from "../../types";

export type DbtTarget = "dev" | "staging" | "prod";

export type DbtIntent = AgentMeta & {
  project: string;
  target: DbtTarget;
  selector: string;
  exclude?: string;
  fullRefresh: boolean;
  expectedModels?: number;
  expectedTests?: number;
  estimatedRuntimeMin?: number;
};

export type DbtPayload = {
  project: string;
  target: DbtTarget;
  selector: string;
  exclude?: string;
  fullRefresh: boolean;
};

export const DBT_DEFAULT: DbtIntent = {
  agent: "atlas",
  action: "dbt-run",
  project: "nordlight_analytics",
  target: "prod",
  selector: "+fct_subscription_revenue+",
  exclude: "tag:experimental",
  fullRefresh: false,
  expectedModels: 18,
  expectedTests: 42,
  estimatedRuntimeMin: 12,
  rationale: "Rebuilding subscription-revenue facts and downstream marts after the May 9 dim_customers schema update. Sticking to incremental — full refresh would be ~3h.",
};

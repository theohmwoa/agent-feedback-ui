import type { AgentMeta } from "../../types";

export type SqlEffect = "read" | "write" | "destructive";

export type SqlIntent = AgentMeta & {
  database: string;
  schema?: string;
  query: string;
  effect: SqlEffect;
  expectedRows?: number;
  affectedTables?: string[];
  isProduction?: boolean;
};

export type SqlPayload = {
  database: string;
  query: string;
};

export const SQL_DEFAULT: SqlIntent = {
  agent: "atlas",
  action: "run-query",
  database: "nordlight-prod",
  schema: "public",
  query: `UPDATE customer_subscriptions
SET status = 'past_due'
WHERE current_period_end < NOW() - INTERVAL '7 days'
  AND status = 'active';`,
  effect: "write",
  expectedRows: 142,
  affectedTables: ["customer_subscriptions"],
  isProduction: true,
  rationale: "Reconciling drift from the May 8 webhook outage — Stripe events for past-due transitions weren't delivered for 6 hours.",
};

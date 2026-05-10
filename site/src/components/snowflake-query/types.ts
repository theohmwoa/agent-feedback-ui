import type { AgentMeta } from "../../types";

export type SnowflakeEffect = "read" | "write" | "destructive";

export type SnowflakeIntent = AgentMeta & {
  warehouse: string;
  database: string;
  schema: string;
  role: string;
  query: string;
  effect: SnowflakeEffect;
  scanGB?: number;
  creditEstimate?: number;
  isProduction?: boolean;
};

export type SnowflakePayload = {
  warehouse: string;
  database: string;
  schema: string;
  role: string;
  query: string;
};

export const SNOWFLAKE_DEFAULT: SnowflakeIntent = {
  agent: "atlas",
  action: "run-query",
  warehouse: "ANALYTICS_XL",
  database: "NORDLIGHT",
  schema: "ANALYTICS",
  role: "ANALYST_ROLE",
  query: `SELECT
  customer_id,
  COUNT(DISTINCT session_id) AS sessions,
  SUM(revenue_usd) AS revenue,
  MAX(event_at) AS last_seen
FROM analytics.events.fact_purchases
WHERE event_at >= DATEADD(day, -30, CURRENT_TIMESTAMP())
  AND tier IN ('pro', 'enterprise')
GROUP BY customer_id
HAVING revenue > 1000
ORDER BY revenue DESC
LIMIT 1000;`,
  effect: "read",
  scanGB: 14.2,
  creditEstimate: 0.18,
  isProduction: true,
  rationale: "Pulling top-revenue accounts from the last 30 days for the partnership review on Thursday.",
};

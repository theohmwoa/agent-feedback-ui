import type { AgentMeta } from "../../types";

export type BigqueryEffect = "read" | "write" | "destructive";

export type BigqueryIntent = AgentMeta & {
  project: string;
  dataset: string;
  query: string;
  effect: BigqueryEffect;
  bytesBilled?: number;     // bytes the dry-run says will be billed
  maxBytesBilled?: number;  // user-set cap
  destinationTable?: string;
  isProduction?: boolean;
};

export type BigqueryPayload = {
  project: string;
  dataset: string;
  query: string;
  maxBytesBilled?: number;
  destinationTable?: string;
};

export const BIGQUERY_DEFAULT: BigqueryIntent = {
  agent: "atlas",
  action: "run-query",
  project: "nordlight-prod-9f2a",
  dataset: "analytics",
  query: `SELECT
  user_id,
  COUNT(*) AS event_count,
  COUNT(DISTINCT session_id) AS sessions,
  APPROX_QUANTILES(event_duration_ms, 100)[OFFSET(95)] AS p95_ms
FROM \`nordlight-prod-9f2a.analytics.events\`
WHERE _PARTITIONDATE BETWEEN DATE("2026-04-01") AND DATE("2026-05-01")
  AND event_name = "agent.action.completed"
GROUP BY user_id
ORDER BY event_count DESC
LIMIT 10000;`,
  effect: "read",
  bytesBilled: 47_300_000_000, // ~47.3 GB
  maxBytesBilled: 100_000_000_000,
  isProduction: true,
  rationale: "Computing p95 agent-action durations per user for the May usage report. Partitions narrowed to one month.",
};

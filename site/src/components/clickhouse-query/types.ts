import type { AgentMeta } from "../../types";

export type ClickhouseEffect = "read" | "write" | "destructive";

export type ClickhouseEngine =
  | "MergeTree"
  | "ReplacingMergeTree"
  | "AggregatingMergeTree"
  | "SummingMergeTree"
  | "Distributed"
  | "MaterializedView";

export type ClickhouseIntent = AgentMeta & {
  cluster: string;
  database: string;
  query: string;
  effect: ClickhouseEffect;
  primaryEngine?: ClickhouseEngine;
  expectedRows?: number;
  estimatedReadGB?: number;
  triggersMaterializedView?: boolean;
  isProduction?: boolean;
};

export type ClickhousePayload = {
  cluster: string;
  database: string;
  query: string;
};

export const CLICKHOUSE_DEFAULT: ClickhouseIntent = {
  agent: "atlas",
  action: "run-query",
  cluster: "ch-prod-01",
  database: "events",
  query: `INSERT INTO events.agent_actions
SELECT
  user_id,
  action,
  toStartOfHour(event_at) AS hour,
  count() AS n,
  uniq(session_id) AS unique_sessions,
  avg(duration_ms) AS avg_duration_ms
FROM events.raw_events
WHERE event_at >= toDateTime('2026-05-09 00:00:00')
  AND event_at <  toDateTime('2026-05-10 00:00:00')
GROUP BY user_id, action, hour;`,
  effect: "write",
  primaryEngine: "ReplacingMergeTree",
  expectedRows: 28_410_000,
  estimatedReadGB: 4.2,
  triggersMaterializedView: true,
  isProduction: true,
  rationale: "Backfilling May 9 hour-aggregates the cron missed. ReplacingMergeTree dedupes by (user_id, action, hour); the downstream materialized view will catch up automatically.",
};

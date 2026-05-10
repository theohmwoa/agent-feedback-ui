import type { AgentMeta } from "../../types";

export type AirbyteSyncMode = "full_refresh" | "incremental" | "incremental_dedup";

export type AirbyteStream = {
  name: string;
  syncMode: AirbyteSyncMode;
  recordCountEstimate?: number;
};

export type AirbyteEndpoint = {
  name: string;       // "Postgres / nordlight-prod"
  kind: string;       // "Postgres"
  hue: number;        // for the colored avatar
};

export type AirbyteIntent = AgentMeta & {
  workspace: string;
  connection: string;
  source: AirbyteEndpoint;
  destination: AirbyteEndpoint;
  streams: AirbyteStream[];
  resetData: boolean;
  isProduction?: boolean;
};

export type AirbyteSyncPayload = {
  workspace: string;
  connection: string;
  resetData: boolean;
  streamNames: string[];
};

export const AIRBYTE_DEFAULT: AirbyteIntent = {
  agent: "atlas",
  action: "trigger-sync",
  workspace: "Nordlight",
  connection: "postgres-nordlight-prod → snowflake-analytics",
  source:      { name: "Postgres / nordlight-prod",         kind: "Postgres",  hue: 220 },
  destination: { name: "Snowflake / NORDLIGHT.RAW",         kind: "Snowflake", hue: 200 },
  streams: [
    { name: "public.customers",         syncMode: "incremental_dedup", recordCountEstimate: 18420 },
    { name: "public.subscriptions",     syncMode: "incremental_dedup", recordCountEstimate: 22810 },
    { name: "public.invoices",          syncMode: "incremental",       recordCountEstimate: 162400 },
    { name: "public.audit_log",         syncMode: "full_refresh",      recordCountEstimate: 4_120_000 },
  ],
  resetData: false,
  isProduction: true,
  rationale: "Catching the warehouse up after the May 9 source-schema change. Incremental will pick up the new column on the next CDC cycle.",
};

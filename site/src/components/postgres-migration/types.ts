import type { AgentMeta } from "../../types";

export type DdlKind = "create" | "alter" | "drop" | "rename" | "data";

export type PostgresMigrationIntent = AgentMeta & {
  database: string;
  environment: string;
  migrationName: string;
  migrationFile: string;
  sql: string;
  ddlSummary: Partial<Record<DdlKind, number>>;
  reversible?: boolean;
  hasDownMigration?: boolean;
  estimatedLockMs?: number;
  affectedTables?: string[];
  isProduction?: boolean;
};

export type PostgresMigrationPayload = {
  database: string;
  migrationFile: string;
  sql: string;
};

export const POSTGRES_MIGRATION_DEFAULT: PostgresMigrationIntent = {
  agent: "atlas",
  action: "run-migration",
  database: "nordlight-prod",
  environment: "production",
  migrationName: "20240518114203_add_subscription_grace_period",
  migrationFile: "db/migrations/20240518114203_add_subscription_grace_period.sql",
  sql: `-- Up
ALTER TABLE customer_subscriptions
  ADD COLUMN grace_period_ends_at TIMESTAMPTZ;

CREATE INDEX CONCURRENTLY idx_subs_grace_period_ends_at
  ON customer_subscriptions (grace_period_ends_at)
  WHERE grace_period_ends_at IS NOT NULL;

-- Down
DROP INDEX CONCURRENTLY IF EXISTS idx_subs_grace_period_ends_at;
ALTER TABLE customer_subscriptions DROP COLUMN IF EXISTS grace_period_ends_at;`,
  ddlSummary: { alter: 1, create: 1 },
  reversible: true,
  hasDownMigration: true,
  estimatedLockMs: 12,
  affectedTables: ["customer_subscriptions"],
  isProduction: true,
  rationale: "Adds the grace_period_ends_at column referenced in the dunning patch — uses CONCURRENTLY for the index so it won't block writes on the hot path.",
};

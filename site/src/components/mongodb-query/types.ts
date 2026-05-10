import type { AgentMeta } from "../../types";

export type MongoOp = "find" | "insert" | "update" | "delete" | "aggregate";

export type MongoIntent = AgentMeta & {
  cluster: string;
  database: string;
  collection: string;
  op: MongoOp;
  query: string;
  expectedDocs?: number;
  indexesUsed?: string[];
  isProduction?: boolean;
};

export type MongoPayload = {
  cluster: string;
  database: string;
  collection: string;
  op: MongoOp;
  query: string;
};

export const MONGO_DEFAULT: MongoIntent = {
  agent: "atlas",
  action: "run-query",
  cluster: "mongo-atlas-prod-0",
  database: "nordlight",
  collection: "user_sessions",
  op: "update",
  query: `db.user_sessions.updateMany(
  {
    last_seen_at: { $lt: new Date("2026-04-01T00:00:00Z") },
    state: "active",
  },
  {
    $set: { state: "expired", expired_at: new Date() },
  }
)`,
  expectedDocs: 8421,
  indexesUsed: ["last_seen_at_1", "state_1"],
  isProduction: true,
  rationale: "Cleanup pass for stale sessions older than 30 days — backfill missed by the May 8 cron failure.",
};

import type { AgentMeta } from "../../types";

export type RedisRisk = "safe" | "caution" | "destructive";

export type RedisIntent = AgentMeta & {
  instance: string;
  database?: number;
  command: string;
  key?: string;
  valuePreview?: string;
  ttlSeconds?: number;
  risk?: RedisRisk;
  isProduction?: boolean;
};

export type RedisPayload = {
  instance: string;
  database?: number;
  command: string;
};

export const REDIS_DEFAULT: RedisIntent = {
  agent: "atlas",
  action: "run-redis",
  instance: "prod-cache-001.cache.use1.amazonaws.com",
  database: 0,
  command: "DEL session:7f3a* (matched 1,284 keys)",
  key: "session:7f3a*",
  valuePreview: "(deletes 1,284 stale session blobs)",
  ttlSeconds: 0,
  risk: "destructive",
  isProduction: true,
  rationale: "Sessions left over from the May 8 deploy that bypassed the new auth gate. Confirmed safe to evict — clients will reauth on next request.",
};

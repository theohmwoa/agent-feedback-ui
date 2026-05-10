import type { AgentMeta } from "../../types";

export type DdMonitorState = "alert" | "warn" | "ok";
export type DdMonitorType = "metric" | "anomaly" | "log" | "trace" | "synthetic" | "process";
export type DdMuteDuration = "5m" | "1h" | "4h" | "1d" | "indef";

export type DdIntent = AgentMeta & {
  monitorId: string;
  monitorName: string;
  type: DdMonitorType;
  state: DdMonitorState;
  tagScope: string[];
  defaultDuration?: DdMuteDuration;
  defaultReason?: string;
  recentTriggers?: number;
};

export type DdPayload = {
  monitorId: string;
  duration: DdMuteDuration;
  reason: string;
  scope: string[];
  createIncident: boolean;
};

export const DD_DEFAULT: DdIntent = {
  agent: "atlas",
  action: "mute-monitor",
  monitorId: "138472901",
  monitorName: "[auth-gateway] p99 latency over 500ms",
  type: "metric",
  state: "alert",
  tagScope: ["env:prod", "service:auth-gateway", "region:us-west-2"],
  defaultDuration: "1h",
  defaultReason: "Known regression in @nl/jwt 2.1.0 — patch in #4187, mitigation deploying now.",
  recentTriggers: 12,
  rationale: "Monitor has fired 12× in the last 30m on the same root cause. Muting buys you time to ship the fix without paging the oncall.",
};

import type { AgentMeta } from "../../types";

export type WebhookMethod = "POST" | "PUT";

export type WebhookHeader = { key: string; value: string };

export type WebhookIntent = AgentMeta & {
  url: string;
  method: WebhookMethod;
  payload: string;
  headers?: WebhookHeader[];
  signatureHeader?: string;
  signaturePreview?: string;
  retryPolicy?: string;
  affectsProduction?: boolean;
};

export type WebhookPayload = {
  url: string;
  method: WebhookMethod;
  body: string;
  headers: WebhookHeader[];
};

export const WEBHOOK_DEFAULT: WebhookIntent = {
  agent: "atlas",
  action: "webhook-fire",
  url: "https://hooks.zapier.com/hooks/catch/4827319/incident-resolved",
  method: "POST",
  payload: `{
  "incident_id": "INC-2271",
  "service": "auth-gateway",
  "resolution": "Module-scoped JWK cache landed in #4187",
  "p99_before_ms": 880,
  "p99_after_ms": 132,
  "resolved_at": "2026-05-10T17:14:08Z",
  "responders": ["priyaraman", "atlas"]
}`,
  headers: [
    { key: "User-Agent",       value: "atlas-agent/0.4" },
    { key: "Content-Type",     value: "application/json" },
    { key: "X-Webhook-Source", value: "atlas" },
  ],
  signatureHeader: "X-Webhook-Signature",
  signaturePreview: "sha256=e3b0c44298fc1c149afbf4c8996fb92427ae41e4...",
  retryPolicy: "5x exponential backoff, 30s → 24m, dead-letter to #ops-alerts",
  affectsProduction: true,
  rationale: "Auth-gateway p99 incident closed at 17:14 UTC. Notifying the on-call dashboard.",
};

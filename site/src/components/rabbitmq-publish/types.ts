import type { AgentMeta } from "../../types";

export type RabbitHeader = { key: string; value: string };

export type RabbitMqIntent = AgentMeta & {
  host: string;
  vhost: string;
  exchange: string;
  routingKey: string;
  body: string;
  persistent?: boolean;
  expirationMs?: number;
  headers?: RabbitHeader[];
  isProduction?: boolean;
};

export type RabbitMqPayload = {
  vhost: string;
  exchange: string;
  routingKey: string;
  body: string;
  persistent: boolean;
  expirationMs?: number;
  headers: RabbitHeader[];
};

export const RABBITMQ_DEFAULT: RabbitMqIntent = {
  agent: "atlas",
  action: "rabbitmq-publish",
  host: "rabbit-prod.nordlight.cloud:5671",
  vhost: "/billing",
  exchange: "subscriptions.events",
  routingKey: "subscription.past_due",
  body: `{
  "customer_id": "cust_4ab92e",
  "subscription_id": "sub_82a91b",
  "occurred_at": "2024-05-18T11:42:18Z",
  "previous_status": "active",
  "next_status": "past_due"
}`,
  persistent: true,
  expirationMs: 86_400_000,
  headers: [
    { key: "x-trace-id",  value: "0af7651916cd43dd8448eb211c80319c" },
    { key: "content-type", value: "application/json" },
  ],
  isProduction: true,
  rationale: "Topic-style fan-out via the subscriptions.events direct exchange — replays the past-due transition the May 8 outage missed.",
};

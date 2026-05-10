import type { AgentMeta } from "../../types";

export type KafkaAck = "0" | "1" | "all";

export type KafkaHeader = { key: string; value: string };

export type KafkaIntent = AgentMeta & {
  cluster: string;
  topic: string;
  partitionKey?: string;
  body: string;
  headers?: KafkaHeader[];
  ack: KafkaAck;
  batchSize?: number;
  isProduction?: boolean;
};

export type KafkaPayload = {
  cluster: string;
  topic: string;
  partitionKey?: string;
  body: string;
  headers: KafkaHeader[];
  ack: KafkaAck;
};

export const KAFKA_DEFAULT: KafkaIntent = {
  agent: "atlas",
  action: "kafka-publish",
  cluster: "kafka-prod-us-east-1",
  topic: "subscriptions.lifecycle.v3",
  partitionKey: "cust_4ab92e",
  body: `{
  "event": "subscription.past_due",
  "customer_id": "cust_4ab92e",
  "subscription_id": "sub_82a91b",
  "occurred_at": "2024-05-18T11:42:18Z",
  "previous_status": "active",
  "next_status": "past_due"
}`,
  headers: [
    { key: "trace-id", value: "0af7651916cd43dd8448eb211c80319c" },
    { key: "schema",   value: "subscription.past_due.v2" },
  ],
  ack: "all",
  batchSize: 1,
  isProduction: true,
  rationale: "Replays the past-due transition the webhook outage missed. Partition keyed on customer_id keeps the lifecycle ordering deterministic.",
};

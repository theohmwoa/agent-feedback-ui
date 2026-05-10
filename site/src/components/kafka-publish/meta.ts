import type { ComponentMeta } from "../../registry";

export const meta: ComponentMeta = {
  id: "kafka-publish",
  name: "kafka-publish",
  title: "Kafka publish",
  accent: "oklch(0.62 0.04 80)",
  summary: "Publish a message to a Kafka topic. Cluster + topic, partition key, headers, ack mode (0 / 1 / all).",
  loc: 220,
  status: "stable",
  category: "queue",
};

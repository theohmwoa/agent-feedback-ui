import type { ComponentMeta } from "../../registry";

export const meta: ComponentMeta = {
  id: "rabbitmq-publish",
  name: "rabbitmq-publish",
  title: "RabbitMQ publish",
  accent: "oklch(0.66 0.18 25)",
  summary: "Publish to a RabbitMQ exchange. Vhost + exchange + routing key, persistent toggle, TTL, headers.",
  loc: 230,
  status: "stable",
  category: "queue",
};

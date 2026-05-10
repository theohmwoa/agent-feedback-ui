export const usage = `import { RabbitMqPublish } from "@/components/agent-ui/rabbitmq-publish";

<RabbitMqPublish
  intent={{
    host: "rabbit-prod.nordlight.cloud:5671",
    vhost: "/billing",
    exchange: "subscriptions.events",
    routingKey: "subscription.past_due",
    body: JSON.stringify(event, null, 2),
    persistent: true,
    expirationMs: 86_400_000,
    headers: [{ key: "x-trace-id", value: traceId }],
    isProduction: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      channel.publish(r.payload.exchange, r.payload.routingKey, Buffer.from(r.payload.body), {
        persistent: r.payload.persistent,
        expiration: r.payload.expirationMs?.toString(),
        headers: kvToObject(r.payload.headers),
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "RabbitMqIntent",                            req: true,  desc: "Host, vhost, exchange, routing key, body, persistent flag, TTL, headers." },
  { name: "onResult", type: "(r: ReviewResult<RabbitMqPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.persistent", type: "boolean", req: false, desc: "When true, sets delivery_mode=2 so the message survives broker restart." },
];

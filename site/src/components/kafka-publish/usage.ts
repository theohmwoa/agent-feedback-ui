export const usage = `import { KafkaPublish } from "@/components/agent-ui/kafka-publish";

<KafkaPublish
  intent={{
    cluster: "kafka-prod-us-east-1",
    topic: "subscriptions.lifecycle.v3",
    partitionKey: customerId,
    body: JSON.stringify(event, null, 2),
    headers: [
      { key: "trace-id", value: traceId },
      { key: "schema",   value: "subscription.past_due.v2" },
    ],
    ack: "all",
    isProduction: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      kafka.send({
        topic: r.payload.topic,
        messages: [{ key: r.payload.partitionKey, value: r.payload.body, headers: kvToObject(r.payload.headers) }],
        acks: r.payload.ack === "all" ? -1 : Number(r.payload.ack),
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "KafkaIntent",                            req: true,  desc: "Cluster, topic, partition key, body, headers, ack mode, batch size." },
  { name: "onResult", type: "(r: ReviewResult<KafkaPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.ack", type: "'0' | '1' | 'all'", req: true, desc: "Required acks. 0 = fire-and-forget, 1 = leader, all = full ISR." },
];

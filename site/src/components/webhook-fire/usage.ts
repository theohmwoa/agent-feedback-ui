export const usage = `import { WebhookFire } from "@/components/agent-ui/webhook-fire";

<WebhookFire
  intent={{
    url: incidentHookUrl,
    method: "POST",
    payload: JSON.stringify(payload, null, 2),
    headers: [
      { key: "Content-Type",     value: "application/json" },
      { key: "X-Webhook-Source", value: "atlas" },
    ],
    signatureHeader: "X-Webhook-Signature",
    signaturePreview: "sha256=" + hmac.digest("hex").slice(0, 40) + "...",
    retryPolicy: "5x exponential backoff, dead-letter to #ops-alerts",
    affectsProduction: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      fetch(r.payload.url, {
        method: r.payload.method,
        headers: Object.fromEntries(r.payload.headers.map(h => [h.key, h.value])),
        body: r.payload.body,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "WebhookIntent",                            req: true,  desc: "URL, method, payload, headers, signature preview, retry policy." },
  { name: "onResult", type: "(r: ReviewResult<WebhookPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
];

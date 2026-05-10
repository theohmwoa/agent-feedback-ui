export const usage = `import { HttpRequest } from "@/components/agent-ui/http-request";

<HttpRequest
  intent={{
    method: "POST",
    url: "https://api.linear.app/graphql",
    headers: [
      { key: "Authorization", value: \`Bearer \${process.env.LINEAR_TOKEN}\` },
      { key: "Content-Type", value: "application/json" },
    ],
    body: JSON.stringify(graphqlPayload),
    affectsProduction: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") fetch(r.payload.url, {
      method: r.payload.method,
      headers: Object.fromEntries(r.payload.headers.map(h => [h.key, h.value])),
      body: r.payload.body,
    });
  }}
/>`;

export const props = [
  { name: "intent",   type: "HttpIntent",                            req: true,  desc: "Method, URL, headers, body, expectedStatus, affectsProduction." },
  { name: "onResult", type: "(r: ReviewResult<HttpPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
];

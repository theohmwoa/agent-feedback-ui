export const usage = `import { ElasticsearchQuery } from "@/components/agent-ui/elasticsearch-query";

<ElasticsearchQuery
  intent={{
    cluster: "logs-prod-1.es.us-east-1.aws.found.io",
    indexPattern: "logs-app-*",
    verb: "POST",                    // "GET" | "POST" | "PUT" | "DELETE"
    path: "/logs-app-*/_search",
    body: JSON.stringify(esBody, null, 2),
    expectedHits: 1842,
    isProduction: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      esClient.transport.request({
        method: r.payload.verb,
        path: r.payload.path,
        body: r.payload.body && JSON.parse(r.payload.body),
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "ElasticsearchIntent",                           req: true,  desc: "Cluster, index pattern, verb, path, body, expected hits, explain, isProduction." },
  { name: "onResult", type: "(r: ReviewResult<ElasticsearchPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.verb", type: "'GET' | 'POST' | 'PUT' | 'DELETE'",          req: true, desc: "DELETE colors the run button red." },
];

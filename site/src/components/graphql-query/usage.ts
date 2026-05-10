export const usage = `import { GraphqlQuery } from "@/components/agent-ui/graphql-query";

<GraphqlQuery
  intent={{
    endpoint: "https://api.shopify.com/admin/api/2024-10/graphql.json",
    operation: "mutation",
    operationName: "ProductUpdatePrice",
    query: agentQuery,
    variables: JSON.stringify({ id, price }, null, 2),
    headers: [
      { key: "X-Shopify-Access-Token", value: process.env.SHOPIFY_TOKEN! },
      { key: "Content-Type",           value: "application/json" },
    ],
    affectsProduction: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      fetch(r.payload.endpoint, {
        method: "POST",
        headers: Object.fromEntries(r.payload.headers.map(h => [h.key, h.value])),
        body: JSON.stringify({
          query: r.payload.query,
          variables: r.payload.variables ? JSON.parse(r.payload.variables) : undefined,
          operationName: r.payload.operationName,
        }),
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "GraphQLIntent",                            req: true,  desc: "Endpoint, operation, query, variables, headers, expectedShape." },
  { name: "onResult", type: "(r: ReviewResult<GraphQLPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
];

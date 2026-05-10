export const usage = `import { ClickhouseQuery } from "@/components/agent-ui/clickhouse-query";

<ClickhouseQuery
  intent={{
    cluster: "ch-prod-01",
    database: "events",
    query: agentQuery,
    effect: "write",
    primaryEngine: "ReplacingMergeTree",
    expectedRows: 28_410_000,
    estimatedReadGB: 4.2,
    triggersMaterializedView: true,
    isProduction: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      clickhouse.query({ query: r.payload.query });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "ClickhouseIntent",                            req: true,  desc: "Cluster, database, query, effect, primaryEngine hint, expected rows, estimated read GB, materialized-view trigger flag, isProduction." },
  { name: "onResult", type: "(r: ReviewResult<ClickhousePayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.triggersMaterializedView", type: "boolean", req: false, desc: "Surfaces a warning chip — INSERTs into MergeTree tables can trigger downstream materialized views to recompute." },
];

export const usage = `import { BigqueryQuery } from "@/components/agent-ui/bigquery-query";

<BigqueryQuery
  intent={{
    project: "nordlight-prod-9f2a",
    dataset: "analytics",
    query: agentQuery,
    effect: "read",
    bytesBilled: dryRun.totalBytesProcessed,
    maxBytesBilled: 100_000_000_000, // 100 GB cap
    isProduction: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      bq.query({
        query: r.payload.query,
        maximumBytesBilled: r.payload.maxBytesBilled?.toString(),
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "BigqueryIntent",                            req: true,  desc: "Project, dataset, query, effect, bytesBilled (from dry-run), maxBytesBilled cap, destinationTable, isProduction." },
  { name: "onResult", type: "(r: ReviewResult<BigqueryPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.bytesBilled", type: "number", req: false, desc: "Result of a BigQuery dry-run; drives the prominent cost estimate." },
];

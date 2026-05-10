export const usage = `import { SqlQueryRunner } from "@/components/agent-ui/sql-query-runner";

<SqlQueryRunner
  intent={{
    database: "nordlight-prod",
    schema: "public",
    query: agentQuery,
    effect: "write",                  // "read" | "write" | "destructive"
    expectedRows: 142,
    affectedTables: ["customer_subscriptions"],
    isProduction: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      pg.query(r.payload.query);
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "SqlIntent",                            req: true,  desc: "Database, schema, query, effect classification, expected rows, affected tables." },
  { name: "onResult", type: "(r: ReviewResult<SqlPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.effect", type: "'read' | 'write' | 'destructive'", req: true, desc: "DESTRUCTIVE colors the run button red. WRITE shows production warning if isProduction." },
];

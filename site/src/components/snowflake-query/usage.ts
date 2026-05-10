export const usage = `import { SnowflakeQuery } from "@/components/agent-ui/snowflake-query";

<SnowflakeQuery
  intent={{
    warehouse: "ANALYTICS_XL",
    database: "NORDLIGHT",
    schema: "ANALYTICS",
    role: "ANALYST_ROLE",
    query: agentQuery,
    effect: "read",
    scanGB: 14.2,
    creditEstimate: 0.18,
    isProduction: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      snowflake.execute({ sqlText: r.payload.query, /* … */ });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "SnowflakeIntent",                            req: true,  desc: "Warehouse, database, schema, role, query, effect, scanGB, creditEstimate, isProduction." },
  { name: "onResult", type: "(r: ReviewResult<SnowflakePayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.scanGB", type: "number", req: false, desc: "Estimated scan size in gigabytes — drives the cost-awareness display." },
];

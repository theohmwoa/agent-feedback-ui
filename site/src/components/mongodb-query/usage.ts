export const usage = `import { MongodbQuery } from "@/components/agent-ui/mongodb-query";

<MongodbQuery
  intent={{
    cluster: "mongo-atlas-prod-0",
    database: "nordlight",
    collection: "user_sessions",
    op: "update",                    // "find" | "insert" | "update" | "delete" | "aggregate"
    query: agentQuery,
    expectedDocs: 8421,
    indexesUsed: ["last_seen_at_1", "state_1"],
    isProduction: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      mongoClient.db(r.payload.database).collection(r.payload.collection).runCommand(/* … */);
    }
  }}
/>`;

export const props = [
  { name: "intent",         type: "MongoIntent",                            req: true,  desc: "Cluster, database, collection, op, query, expected docs, indexes, isProduction." },
  { name: "onResult",       type: "(r: ReviewResult<MongoPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.op",      type: "'find' | 'insert' | 'update' | 'delete' | 'aggregate'", req: true, desc: "DELETE colors the run button red. Other ops use the primary." },
  { name: "intent.indexesUsed", type: "string[]", req: false, desc: "Optional list of MongoDB index names that the query planner expects to use." },
];

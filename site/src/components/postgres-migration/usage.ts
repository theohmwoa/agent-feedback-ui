export const usage = `import { PostgresMigration } from "@/components/agent-ui/postgres-migration";

<PostgresMigration
  intent={{
    database: "nordlight-prod",
    environment: "production",
    migrationName,
    migrationFile,
    sql: sqlContent,
    ddlSummary: { alter: 1, create: 1 },
    reversible: true,
    hasDownMigration: true,
    estimatedLockMs: 12,
    affectedTables: ["customer_subscriptions"],
    isProduction: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      pg.runMigration(r.payload.sql, { db: r.payload.database });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "PostgresMigrationIntent", req: true,  desc: "Database, environment, migration name + file path, full SQL, DDL summary, lock-time estimate, reversibility flags." },
  { name: "onResult", type: "(r: ReviewResult<PostgresMigrationPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.ddlSummary", type: "Partial<Record<DdlKind, number>>", req: true, desc: "Counts per CREATE / ALTER / DROP / RENAME / DATA — DROP triggers the destructive submit color." },
];

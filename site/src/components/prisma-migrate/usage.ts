export const usage = `import { PrismaMigrate } from "@/components/agent-ui/prisma-migrate";

<PrismaMigrate
  intent={{
    environment: "production",
    migrationName: "add_user_phone_verification",
    schemaPath: "prisma/schema.prisma",
    changes: schemaDiff,                  // PrismaSchemaChange[]
    reset: false,
    affectedRowCount: rows,
    isProduction: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      execSync(\`prisma migrate \${r.payload.reset ? "reset --force" : "deploy"}\`);
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "PrismaMigrateIntent",                            req: true,  desc: "Environment, migration name, schema path, schema diff (changes), reset flag, affected-row estimate." },
  { name: "onResult", type: "(r: ReviewResult<PrismaMigratePayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.reset",  type: "boolean", req: false, desc: "When true, destroys all tables. Surfaces a hard confirmation gate in production." },
  { name: "intent.changes", type: "PrismaSchemaChange[]", req: true, desc: "{ kind: 'add' | 'remove' | 'modify', model, field?, detail } — rendered as a colored diff list." },
];

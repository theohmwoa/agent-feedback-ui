import type { AgentMeta } from "../../types";

export type PrismaSchemaChange = {
  kind: "add" | "remove" | "modify";
  model: string;
  field?: string;
  detail: string;
};

export type PrismaMigrateIntent = AgentMeta & {
  environment: "development" | "staging" | "production";
  migrationName: string;
  schemaPath: string;
  changes: PrismaSchemaChange[];
  reset?: boolean;
  willDropTables?: string[];
  affectedRowCount?: number;
  isProduction?: boolean;
};

export type PrismaMigratePayload = {
  environment: string;
  migrationName: string;
  reset: boolean;
};

export const PRISMA_MIGRATE_DEFAULT: PrismaMigrateIntent = {
  agent: "atlas",
  action: "prisma-migrate",
  environment: "production",
  migrationName: "add_user_phone_verification",
  schemaPath: "prisma/schema.prisma",
  changes: [
    { kind: "add",    model: "User",     field: "phoneVerified",       detail: "Boolean @default(false)" },
    { kind: "add",    model: "User",     field: "phoneVerifiedAt",     detail: "DateTime?" },
    { kind: "modify", model: "User",     field: "phone",               detail: "String → String? (nullable)" },
    { kind: "add",    model: "PhoneOtp", detail: "@@map(\"phone_otps\") with userId, code, expiresAt" },
  ],
  reset: false,
  willDropTables: [],
  affectedRowCount: 18420,
  isProduction: true,
  rationale: "Wires the SMS-OTP feature schema referenced in the dunning epic. Phone field becomes nullable so we can store unverified contacts before they confirm.",
};

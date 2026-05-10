import type { ComponentMeta } from "../../registry";

export const meta: ComponentMeta = {
  id: "postgres-migration",
  name: "postgres-migration",
  title: "Postgres migration",
  accent: "oklch(0.62 0.13 240)",
  summary: "Run a Postgres migration. DDL summary, lock-time estimate, reversibility check, production warning.",
  loc: 240,
  status: "stable",
  category: "data",
};

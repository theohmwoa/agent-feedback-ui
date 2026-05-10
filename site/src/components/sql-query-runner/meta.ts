import type { ComponentMeta } from "../../registry";

export const meta: ComponentMeta = {
  id: "sql-query-runner",
  name: "sql-query-runner",
  title: "SQL query runner",
  accent: "oklch(0.74 0.10 200)",
  summary: "Approve a query before it hits prod. READ / WRITE / DESTRUCTIVE classification, expected rows, affected tables.",
  loc: 280,
  status: "stable",
  category: "data",
};

import type { ComponentMeta } from "../../registry";

export const meta: ComponentMeta = {
  id: "dbt-run",
  name: "dbt-run",
  title: "dbt run",
  accent: "oklch(0.62 0.18 25)",
  summary: "Approve a dbt run. Target picker (dev/staging/prod), selector + exclude, full-refresh confirmation on prod.",
  loc: 250,
  status: "stable",
  category: "data",
};

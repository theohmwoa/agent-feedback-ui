import type { ComponentMeta } from "../../registry";

export const meta: ComponentMeta = {
  id: "redis-command",
  name: "redis-command",
  title: "Redis command",
  accent: "oklch(0.62 0.18 25)",
  summary: "Approve a Redis command before it runs. Auto-classifies DEL/FLUSH/UNLINK as destructive, requires typing the instance name on prod.",
  loc: 220,
  status: "stable",
  category: "data",
};

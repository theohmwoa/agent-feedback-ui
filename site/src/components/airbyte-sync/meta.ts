import type { ComponentMeta } from "../../registry";

export const meta: ComponentMeta = {
  id: "airbyte-sync",
  name: "airbyte-sync",
  title: "Airbyte sync",
  accent: "oklch(0.66 0.13 280)",
  summary: "Trigger an Airbyte sync. Source → destination card, per-stream sync mode, reset-data confirmation.",
  loc: 270,
  status: "stable",
  category: "data",
};

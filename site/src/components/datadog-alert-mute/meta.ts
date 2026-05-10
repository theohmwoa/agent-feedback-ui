import type { ComponentMeta } from "../../registry";

export const meta: ComponentMeta = {
  id: "datadog-alert-mute",
  name: "datadog-alert-mute",
  title: "Datadog alert mute",
  accent: "oklch(0.62 0.13 280)",
  summary: "Mute a Datadog monitor with tag-scoped duration, audit-logged reason, optional incident creation.",
  loc: 240,
  status: "stable",
  category: "observability",
};

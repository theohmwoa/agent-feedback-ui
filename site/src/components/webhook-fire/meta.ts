import type { ComponentMeta } from "../../registry";

export const meta: ComponentMeta = {
  id: "webhook-fire",
  name: "webhook-fire",
  title: "Webhook fire",
  accent: "oklch(0.66 0.13 280)",
  summary: "POST or PUT to an arbitrary webhook. Payload preview, retry policy, HMAC signature header.",
  loc: 280,
  status: "stable",
  category: "integration",
};

import type { ComponentMeta } from "../../registry";

export const meta: ComponentMeta = {
  id: "slack-message",
  name: "slack-message",
  title: "Slack message",
  accent: "var(--c-slack)",
  summary: "Reply in a thread or post to a channel. Mention chips, broadcast toggle, parent-message context.",
  deps: ["lucide-react"],
  loc: 286,
  status: "stable",
  category: "messaging",
};

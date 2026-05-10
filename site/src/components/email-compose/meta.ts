import type { ComponentMeta } from "../../registry";

export const meta: ComponentMeta = {
  id: "email-compose",
  name: "email-compose",
  title: "Email compose",
  accent: "var(--c-mail)",
  summary: "Review and edit an email before the agent sends it. Address pills, tone hint, send keystroke.",
  deps: ["lucide-react"],
  loc: 412,
  status: "stable",
  category: "messaging",
};

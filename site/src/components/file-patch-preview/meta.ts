import type { ComponentMeta } from "../../registry";

export const meta: ComponentMeta = {
  id: "file-patch-preview",
  name: "file-patch-preview",
  title: "File patch preview",
  accent: "oklch(0.78 0.10 145)",
  summary: "Inline diff with per-hunk approve/reject. Apply only the hunks you want; the rest go back to the agent.",
  loc: 360,
  status: "stable",
  category: "code",
};

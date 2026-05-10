import type { ComponentMeta } from "../../registry";

export const meta: ComponentMeta = {
  id: "s3-delete",
  name: "s3-delete",
  title: "S3 delete",
  accent: "oklch(0.66 0.18 60)",
  summary: "Permanently delete S3 objects. Type-the-bucket-name confirmation, big delete count, optional include-all-versions for full destruction.",
  loc: 280,
  status: "stable",
  category: "storage",
};

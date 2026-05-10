import type { AgentMeta } from "../../types";

export type S3DeleteObject = {
  key: string;
  sizeBytes: number;
  lastModified: string;
  versions?: number;
};

export type S3DeleteIntent = AgentMeta & {
  bucket: string;
  region?: string;
  objects: S3DeleteObject[];
  includeAllVersions: boolean;
  isProduction?: boolean;
};

export type S3DeletePayload = {
  bucket: string;
  keys: string[];
  includeAllVersions: boolean;
};

export const S3_DELETE_DEFAULT: S3DeleteIntent = {
  agent: "atlas",
  action: "delete-s3",
  bucket: "nordlight-customer-exports",
  region: "us-east-1",
  objects: [
    { key: "exports/2026-03/customer-batch-1/accounts.csv",      sizeBytes: 1_840_000, lastModified: "2026-03-04 09:14 UTC", versions: 2 },
    { key: "exports/2026-03/customer-batch-1/subscriptions.csv", sizeBytes: 7_120_000, lastModified: "2026-03-04 09:14 UTC", versions: 2 },
    { key: "exports/2026-03/customer-batch-1/events.parquet",    sizeBytes: 168_000_000, lastModified: "2026-03-04 09:14 UTC" },
    { key: "exports/2026-03/customer-batch-1/manifest.json",     sizeBytes: 1024, lastModified: "2026-03-04 09:15 UTC", versions: 4 },
    { key: "exports/2026-03/customer-batch-2/accounts.csv",      sizeBytes: 2_010_000, lastModified: "2026-03-11 11:02 UTC" },
    { key: "exports/2026-03/customer-batch-2/manifest.json",     sizeBytes: 1124, lastModified: "2026-03-11 11:03 UTC", versions: 2 },
  ],
  includeAllVersions: false,
  isProduction: true,
  rationale: "Lifecycle cleanup of March exports — past the 60-day retention window for the partnership data sharing agreement.",
};

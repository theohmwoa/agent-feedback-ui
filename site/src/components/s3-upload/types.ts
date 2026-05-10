import type { AgentMeta } from "../../types";

export type S3StorageClass = "Standard" | "IntelligentTiering" | "InfrequentAccess" | "Glacier" | "DeepArchive";

export type S3UploadFile = {
  name: string;
  sizeBytes: number;
  contentType: string;
  willOverwrite?: boolean;
};

export type S3UploadIntent = AgentMeta & {
  bucket: string;
  keyPrefix: string;
  files: S3UploadFile[];
  storageClass: S3StorageClass;
  publicAccess: boolean;
  encryption: "AES256" | "aws:kms" | "none";
  isProduction?: boolean;
};

export type S3UploadPayload = {
  bucket: string;
  keyPrefix: string;
  storageClass: S3StorageClass;
  publicAccess: boolean;
  encryption: "AES256" | "aws:kms" | "none";
};

export const S3_UPLOAD_DEFAULT: S3UploadIntent = {
  agent: "atlas",
  action: "upload-s3",
  bucket: "nordlight-customer-exports",
  keyPrefix: "exports/2026-05/customer-batch-3",
  files: [
    { name: "accounts.csv",       sizeBytes: 2_140_000, contentType: "text/csv" },
    { name: "subscriptions.csv",  sizeBytes: 8_920_000, contentType: "text/csv" },
    { name: "events.parquet",     sizeBytes: 184_000_000, contentType: "application/octet-stream" },
    { name: "manifest.json",      sizeBytes: 1_244, contentType: "application/json", willOverwrite: true },
  ],
  storageClass: "IntelligentTiering",
  publicAccess: false,
  encryption: "aws:kms",
  isProduction: true,
  rationale: "Generating the May export batch for the partnership review. Manifest will overwrite the previous run from May 9.",
};

export const usage = `import { S3Upload } from "@/components/agent-ui/s3-upload";

<S3Upload
  intent={{
    bucket: "nordlight-customer-exports",
    keyPrefix: "exports/2026-05/customer-batch-3",
    files: [
      { name: "accounts.csv", sizeBytes: 2_140_000, contentType: "text/csv" },
      { name: "manifest.json", sizeBytes: 1244, contentType: "application/json", willOverwrite: true },
    ],
    storageClass: "IntelligentTiering",
    publicAccess: false,
    encryption: "aws:kms",
    isProduction: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      uploadToS3(r.payload);
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "S3UploadIntent",                            req: true,  desc: "Bucket, key prefix, files (with willOverwrite hints), storage class, public access, encryption, isProduction." },
  { name: "onResult", type: "(r: ReviewResult<S3UploadPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.publicAccess", type: "boolean", req: true, desc: "Highlights as a warning if turned ON; banner pill labels the upload as public." },
];

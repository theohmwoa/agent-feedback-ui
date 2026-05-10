export const usage = `import { S3Delete } from "@/components/agent-ui/s3-delete";

<S3Delete
  intent={{
    bucket: "nordlight-customer-exports",
    region: "us-east-1",
    objects: agentObjects,           // S3DeleteObject[]
    includeAllVersions: false,
    isProduction: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      s3.deleteObjects({
        Bucket: r.payload.bucket,
        Delete: { Objects: r.payload.keys.map(Key => ({ Key })) },
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "S3DeleteIntent",                            req: true,  desc: "Bucket, region, list of objects (with versions), includeAllVersions, isProduction." },
  { name: "onResult", type: "(r: ReviewResult<S3DeletePayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.objects", type: "S3DeleteObject[]", req: true, desc: "Each: { key, sizeBytes, lastModified, versions? }. Versions surface in the per-row chip and the totals." },
];

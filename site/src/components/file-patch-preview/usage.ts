export const usage = `import { FilePatchPreview } from "@/components/agent-ui/file-patch-preview";

<FilePatchPreview
  intent={{
    files: agentDiff,           // PatchFile[] — { path, hunks: [{ id, header, lines }] }
  }}
  onResult={(r) => {
    if (r.kind === "submit") applyPatch(r.payload.files);
    if (r.kind === "edit") {
      // r.payload.files contains only the approved hunks
      applyPatch(r.payload.files);
      // r.payload.approvedHunks is the list of approved hunk ids
      agent.continue({ rejectedHunks: allHunkIds.filter(id => !r.payload.approvedHunks.includes(id)) });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "PatchIntent",                            req: true,  desc: "Files with hunks. Each hunk has an id, a header, and a list of context/add/del lines." },
  { name: "onResult", type: "(r: ReviewResult<PatchPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'. Edit means partial approval." },
];

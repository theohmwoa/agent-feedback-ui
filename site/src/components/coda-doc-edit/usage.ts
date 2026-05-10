export const usage = `import { CodaDocEdit } from "@/components/agent-ui/coda-doc-edit";

<CodaDocEdit
  intent={agentDraft}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      // ship it
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "CodaDocEditIntent", req: true,  desc: "Agent draft + context fields. See types.ts." },
  { name: "onResult", type: "(r: ReviewResult<CodaDocEditPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
];

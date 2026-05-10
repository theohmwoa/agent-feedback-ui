export const usage = `import { PinterestPin } from "@/components/agent-ui/pinterest-pin";

<PinterestPin
  intent={agentDraft}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      // ship it
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "PinterestPinIntent", req: true,  desc: "Agent draft + context fields. See types.ts." },
  { name: "onResult", type: "(r: ReviewResult<PinterestPinPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
];

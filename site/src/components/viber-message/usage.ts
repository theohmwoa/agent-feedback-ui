export const usage = `import { ViberMessage } from "@/components/agent-ui/viber-message";

<ViberMessage
  intent={agentDraft}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      // ship it
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "ViberMessageIntent", req: true,  desc: "Agent draft + context fields. See types.ts." },
  { name: "onResult", type: "(r: ReviewResult<ViberMessagePayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
];

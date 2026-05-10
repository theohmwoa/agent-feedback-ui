export const usage = `import { TwitterDm } from "@/components/agent-ui/twitter-dm";

<TwitterDm
  intent={{
    recipient: {
      handle: "@priyaraman",
      displayName: "Priya Raman",
      followsYou: false,
    },
    priorMessage: { author: "them", time: "yesterday", text: lastInbound },
    message: agentDraft,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      twitter.dm.create({
        recipient: r.payload.recipientHandle,
        text: r.payload.message,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",            type: "TwitterDmIntent",                            req: true,  desc: "Recipient profile, optional prior message bubble, draft message." },
  { name: "onResult",          type: "(r: ReviewResult<TwitterDmPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "recipient.followsYou", type: "boolean",                                 req: false, desc: "If false, the modal renders 'message request' affordance and the send-button label changes." },
];

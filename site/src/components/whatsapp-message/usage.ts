export const usage = `import { WhatsappMessage } from "@/components/agent-ui/whatsapp-message";

<WhatsappMessage
  intent={{
    to: contact.phone,
    toName: contact.name,
    message: agentDraft,
    templateName: "ops_status_update",
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      whatsapp.messages.send({ to: r.payload.to, body: r.payload.message });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "WhatsappIntent",                            req: true,  desc: "Recipient phone, optional name + template name, draft message." },
  { name: "onResult", type: "(r: ReviewResult<WhatsappPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
];

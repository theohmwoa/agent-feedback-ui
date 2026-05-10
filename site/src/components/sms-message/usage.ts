export const usage = `import { SmsMessage } from "@/components/agent-ui/sms-message";

<SmsMessage
  intent={{
    to: contact.phone,
    toName: contact.name,
    message: agentDraft,
    carrier: "Verizon",
    costEstimate: "$0.0079",
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      twilio.messages.create({
        to: r.payload.to,
        body: r.payload.message,
        sendAt: r.payload.scheduleAt,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "SmsIntent",                            req: true,  desc: "Recipient, message, optional name/carrier/cost preview." },
  { name: "onResult", type: "(r: ReviewResult<SmsPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
];

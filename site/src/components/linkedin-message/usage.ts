export const usage = `import { LinkedInMessage } from "@/components/agent-ui/linkedin-message";

<LinkedInMessage
  intent={{
    recipient: {
      name: "Rubén Sánchez",
      headline: "Engineering Manager · Windmill",
      inNetwork: false,
    },
    message: agentDraft,
    isInMail: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      linkedin.messages.send({
        recipient: r.payload.recipientName,
        body: r.payload.message,
        inMail: r.payload.isInMail,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "LinkedInMessageIntent",                            req: true,  desc: "Recipient profile, optional prior message bubble, draft message, isInMail flag." },
  { name: "onResult", type: "(r: ReviewResult<LinkedInMessagePayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "isInMail", type: "boolean",                                         req: false, desc: "Auto-derived from recipient.inNetwork === false. Surfaces an InMail badge + 'uses 1 InMail credit' hint in footer." },
];

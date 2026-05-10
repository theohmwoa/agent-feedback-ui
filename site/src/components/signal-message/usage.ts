export const usage = `import { SignalMessage } from "@/components/agent-ui/signal-message";

<SignalMessage
  intent={{
    to: contact.phone,
    toName: contact.name,
    toHandle: contact.signalHandle,
    message: agentDraft,
    disappearingTimer: "1d",
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      signal.send({
        to: r.payload.to,
        body: r.payload.message,
        timer: r.payload.disappearingTimer,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "SignalIntent",                            req: true,  desc: "Recipient (phone or handle), draft message, optional disappearing timer." },
  { name: "onResult", type: "(r: ReviewResult<SignalPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.disappearingTimer", type: "'off' | '30s' | '5m' | '1h' | '1d' | '1w'", req: false, desc: "Pre-selects the timer pill; user can override." },
];

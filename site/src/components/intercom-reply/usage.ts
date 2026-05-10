export const usage = `import { IntercomReply } from "@/components/agent-ui/intercom-reply";

<IntercomReply
  intent={{
    customer: { name, email, plan, lastSeen },
    conversationId: "57291",
    priorMessage: { author, text, time },
    reply: agentDraft,
    internalNote: false,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      intercom.conversations.reply(r.payload.conversationId, {
        message_type: r.payload.internalNote ? "note" : "comment",
        body: r.payload.reply,
        snooze_until: r.payload.snooze,
      });
      if (r.payload.closeAfter) intercom.conversations.close(r.payload.conversationId);
    }
  }}
/>`;

export const props = [
  { name: "intent",       type: "IntercomIntent",                            req: true,  desc: "Customer card, conversation id, prior message, draft reply." },
  { name: "onResult",     type: "(r: ReviewResult<IntercomPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "internalNote", type: "boolean",                                   req: false, desc: "If true, agent drafted an internal note rather than a customer-facing reply." },
];

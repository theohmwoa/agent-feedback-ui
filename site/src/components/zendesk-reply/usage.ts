export const usage = `import { ZendeskReply } from "@/components/agent-ui/zendesk-reply";

<ZendeskReply
  intent={{
    ticketNumber: 88421,
    subject,
    requester: { name, email },
    organization: "Northstar Agency",
    priority: "High",
    reply: agentDraft,
    isInternal: false,
    newStatus: "pending",
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      zendesk.tickets.update(r.payload.ticketNumber, {
        comment: { body: r.payload.reply, public: !r.payload.isInternal },
        status: r.payload.newStatus,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",     type: "ZendeskIntent",                            req: true,  desc: "Ticket #/subject, requester, organization, priority, draft reply, status." },
  { name: "onResult",   type: "(r: ReviewResult<ZendeskPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "newStatus",  type: "'open' | 'pending' | 'solved' | 'closed'", req: false, desc: "What to set the ticket status to after replying. Defaults to 'pending'." },
];

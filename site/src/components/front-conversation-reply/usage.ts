export const usage = `import { FrontConversationReply } from "@/components/agent-ui/front-conversation-reply";

<FrontConversationReply
  intent={{
    conversationId: "cnv_8a4f1c",
    channel: "email",
    subject: "Re: refund for duplicate charge",
    recipients: ["billing@northwind.dev"],
    reply: agentDraft,
    assignee: "Soraya Khaled",
    tags: ["billing", "refund"],
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      front.conversations.reply(r.payload.conversationId, {
        body: r.payload.reply,
        assignee_id: r.payload.assignee,
        tags: r.payload.tags,
        snooze_until: r.payload.snooze,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "FrontIntent",                            req: true,  desc: "Channel, recipients, conversation id, draft reply, assignee, tags." },
  { name: "onResult", type: "(r: ReviewResult<FrontPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "channel",  type: "'email' | 'sms' | 'chat' | 'twitter'",   req: true,  desc: "Drives the channel pill in the header." },
];

export const usage = `import { MailchimpBroadcast } from "@/components/agent-ui/mailchimp-broadcast";

<MailchimpBroadcast
  intent={{
    list: "Customers · monthly",
    segment: "Engaged in last 30 days",
    audienceCount: 14_287,
    subject: agentSubject,
    previewText: agentPreview,
    fromName: "Atlas at Northwind",
    fromEmail: "atlas@northwind.dev",
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      mailchimp.campaigns.send({
        list_id, segment_id,
        settings: { subject_line: r.payload.subject, preview_text: r.payload.previewText, from_name: r.payload.fromName },
        send_at: r.payload.scheduleAt,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",         type: "MailchimpIntent",                            req: true,  desc: "List, optional segment, audience count, subject, preview text, from-name." },
  { name: "onResult",       type: "(r: ReviewResult<MailchimpPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "audienceCount",  type: "number",                                    req: true,  desc: "Drives the big-number reach hero. Pre-compute it from list + segment." },
];

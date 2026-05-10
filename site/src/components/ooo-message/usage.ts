export const usage = `import { OooMessage } from "@/components/agent-ui/ooo-message";

<OooMessage
  intent={{
    startsAt: "2026-05-26T09:00",
    endsAt:   "2026-06-02T09:00",
    subject: "Out of office — back June 2",
    body: "Hi {first_name}, I'm out through June 1...",
    scope: "everyone",
    urgentPager: "ops@nordlight.studio",
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      gmail.users.settings.updateVacation({ ...r.payload });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "OooIntent",                            req: true,  desc: "Date range, subject template, body with {merge_fields}, reply scope, urgent pager." },
  { name: "onResult", type: "(r: ReviewResult<OooPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "scope",    type: "'everyone' | 'contacts' | 'external'",  req: false, desc: "Who receives the auto-reply. Defaults to 'everyone'." },
];

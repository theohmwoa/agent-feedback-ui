export const usage = `import { ZapierZapTrigger } from "@/components/agent-ui/zapier-zap-trigger";

<ZapierZapTrigger
  intent={{
    zapTitle: zap.title,
    zapId: zap.id,
    trigger: { app: "Stripe", appShort: "St", appColor: "#635bff", action: "invoice.created" },
    outcome: { app: "Google Sheets", appShort: "Gs", appColor: "#0f9d58", action: "Append row" },
    fields: zap.required.map(f => ({ name: f.key, label: f.label, value: agentValue[f.key], required: f.required })),
    lastRunAt: zap.lastRunAt,
    lastRunStatus: zap.lastRunStatus,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      zapier.runs.create({
        zap_id: r.payload.zapId,
        input: r.payload.fields,
        skip_filters: r.payload.skipFilters,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "ZapierIntent",                            req: true,  desc: "Zap title + id, trigger + outcome step (app + color), input fields, skipFilters." },
  { name: "onResult", type: "(r: ReviewResult<ZapierPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
];

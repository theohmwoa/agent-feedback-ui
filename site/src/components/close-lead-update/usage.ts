export const usage = `import { CloseLeadUpdate } from "@/components/agent-ui/close-lead-update";

<CloseLeadUpdate
  intent={{
    leadId: lead.id,
    companyName: lead.display_name,
    description: lead.description,
    url: lead.url,
    statuses: workspace.statuses,
    currentStatusId: lead.status_id,
    proposedStatusId: "demo",
    lastActivity: "Inbound email — 4h ago",
    opportunitiesCount: opportunities.length,
    opportunitiesValueCents: opportunities.reduce((acc, o) => acc + o.value, 0),
    currency: "USD",
    address: lead.addresses[0],
    customFields: lead.custom_fields,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      close.leads.update(r.payload.leadId, {
        status_id: r.payload.statusId,
        custom: Object.fromEntries(r.payload.customFields.map(f => [f.key, f.value])),
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "CloseLeadIntent",                            req: true,  desc: "Lead, statuses (with type for color), proposed status, opportunities, address, custom fields." },
  { name: "onResult", type: "(r: ReviewResult<CloseLeadPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.statuses", type: "CloseLeadStatus[]",                   req: true,  desc: "Each status has a type (active/won/lost/potential) that drives the color." },
];

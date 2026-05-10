export const usage = `import { HubspotContactUpdate } from "@/components/agent-ui/hubspot-contact-update";

<HubspotContactUpdate
  intent={{
    contactId: contact.id,
    firstName: contact.firstname,
    lastName: contact.lastname,
    email: contact.email,
    jobTitle: contact.jobtitle,
    company: contact.company,
    lifecycleStage: contact.lifecyclestage,
    changes: agentDiff,
    associatedDeals: deals.length,
    associatedCompanies: companies.length,
    logActivity: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      hubspot.crm.contacts.basicApi.update(r.payload.contactId, {
        properties: Object.fromEntries(r.payload.changes.map(c => [c.property, c.after])),
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "HubspotContactIntent",                            req: true,  desc: "Contact identity, current lifecycle stage, property diffs, association counts." },
  { name: "onResult", type: "(r: ReviewResult<HubspotContactPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.changes", type: "HubspotPropertyChange[]",                   req: true,  desc: "Each row: property, label, before, after. User can edit `after` or drop the row." },
];

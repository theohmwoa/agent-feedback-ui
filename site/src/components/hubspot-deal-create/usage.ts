export const usage = `import { HubspotDealCreate } from "@/components/agent-ui/hubspot-deal-create";

<HubspotDealCreate
  intent={{
    pipelineId: "default",
    pipelineLabel: "Sales pipeline",
    stages: pipeline.stages,
    stageId: "qualifiedtobuy",
    dealName: "Nordlight — Platform tier",
    amountCents: 4_800_000,
    currency: "USD",
    closeDate: "2026-07-31",
    dealType: "newbusiness",
    contacts: [
      { email: maya.email, name: maya.name, primary: true },
    ],
    associatedCompany: "Nordlight Studio",
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      hubspot.crm.deals.basicApi.create({
        properties: {
          dealname: r.payload.dealName,
          amount: String(r.payload.amountCents / 100),
          dealstage: r.payload.stageId,
          pipeline: r.payload.pipelineId,
          closedate: r.payload.closeDate,
          dealtype: r.payload.dealType,
        },
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "HubspotDealIntent",                            req: true,  desc: "Pipeline definition, deal name, amount in cents, currency, stage, close date, contacts." },
  { name: "onResult", type: "(r: ReviewResult<HubspotDealPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.stages", type: "HubspotPipelineStage[]",                   req: true,  desc: "Renders as colored chips with probability badges. User picks one." },
];

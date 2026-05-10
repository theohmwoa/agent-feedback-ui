export const usage = `import { PipedriveDeal } from "@/components/agent-ui/pipedrive-deal";

<PipedriveDeal
  intent={{
    mode: "move",                       // "create" | "move"
    title: "Halcyon Robotics — annual subscription",
    valueCents: 1_842_000,
    currency: "USD",
    pipelines: pipelines.list,
    pipelineId: 1,
    stageId: 14,
    expectedCloseDate: "2026-06-15",
    person:       { id: yuki.id, name: yuki.name },
    organization: { id: halcyon.id, name: halcyon.name },
    owner: { name: theo.name, email: theo.email },
    labels: dealLabels,
    availableLabels: allLabels,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      pipedrive.deals[r.payload.mode === "create" ? "add" : "update"](dealId, {
        title: r.payload.title,
        value: r.payload.valueCents / 100,
        currency: r.payload.currency,
        pipeline_id: r.payload.pipelineId,
        stage_id: r.payload.stageId,
        expected_close_date: r.payload.expectedCloseDate,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "PipedriveDealIntent",                            req: true,  desc: "Mode (create/move), title, value in cents, pipelines + stages, person + organization, owner, labels." },
  { name: "onResult", type: "(r: ReviewResult<PipedriveDealPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.pipelines", type: "PipedrivePipeline[]",                    req: true,  desc: "Each pipeline has its own stages. Switching pipeline resets the stage." },
];

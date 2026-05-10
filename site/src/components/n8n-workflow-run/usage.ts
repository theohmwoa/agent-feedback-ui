export const usage = `import { N8nWorkflowRun } from "@/components/agent-ui/n8n-workflow-run";

<N8nWorkflowRun
  intent={{
    workflowName: workflow.name,
    workflowId: workflow.id,
    nodes: workflow.nodes.map(n => ({ name: n.displayName, short: n.shortName })),
    inputJson: JSON.stringify(input, null, 2),
    mode: "production",          // "manual" | "webhook-test" | "production"
    pinnedData: false,
    isActive: workflow.active,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      n8n.workflows.execute({
        id: r.payload.workflowId,
        mode: r.payload.mode,
        data: JSON.parse(r.payload.input),
        pinned: r.payload.pinnedData,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "N8nIntent",                            req: true,  desc: "Workflow name + id, node list (for diagram), input JSON, mode, pinned-data flag." },
  { name: "onResult", type: "(r: ReviewResult<N8nPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
];

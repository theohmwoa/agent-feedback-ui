export const usage = `import { VercelDeploy } from "@/components/agent-ui/vercel-deploy";

<VercelDeploy
  intent={agentDraft}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      // ship it
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "VercelDeployIntent", req: true,  desc: "Agent draft + context fields. See types.ts." },
  { name: "onResult", type: "(r: ReviewResult<VercelDeployPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
];

export const usage = `import { DockerBuild } from "@/components/agent-ui/docker-build";

<DockerBuild
  intent={agentDraft}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      // ship it
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "DockerBuildIntent", req: true,  desc: "Agent draft + context fields. See types.ts." },
  { name: "onResult", type: "(r: ReviewResult<DockerBuildPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
];

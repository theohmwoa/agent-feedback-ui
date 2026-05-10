export const usage = `import { DbtRun } from "@/components/agent-ui/dbt-run";

<DbtRun
  intent={{
    project: "nordlight_analytics",
    target: "prod",                  // "dev" | "staging" | "prod"
    selector: "+fct_subscription_revenue+",
    exclude: "tag:experimental",
    fullRefresh: false,
    expectedModels: 18,
    expectedTests: 42,
    estimatedRuntimeMin: 12,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      execSync(\`dbt run --target \${r.payload.target} --select '\${r.payload.selector}'\`);
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "DbtIntent",                            req: true,  desc: "Project, target, selector, exclude, fullRefresh, expectedModels, expectedTests, estimatedRuntimeMin." },
  { name: "onResult", type: "(r: ReviewResult<DbtPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.fullRefresh", type: "boolean", req: true, desc: "Full-refresh + prod requires typing the project name to confirm." },
];

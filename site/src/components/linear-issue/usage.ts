export const usage = `import { LinearIssue } from "@/components/agent-ui/linear-issue";

<LinearIssue
  intent={{
    team: "PLAT",
    identifier: nextIssueId,
    title, description, priority: "Urgent",
    labels: ["performance", "auth-gateway"],
    assignee: { name: "Priya Raman" },
  }}
  onResult={(r) => r.kind === "submit"
    ? linear.issues.create(r.payload)
    : agent.continue({ skip: true })
  }
/>`;

export const props = [
  { name: "intent",   type: "LinearIntent",                            req: true,  desc: "Team, identifier, title, description, priority, labels, assignee, estimate." },
  { name: "onResult", type: "(r: ReviewResult<LinearPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "priority", type: "'No' | 'Low' | 'Med' | 'High' | 'Urgent'", req: false, desc: "Defaults to 'No'. Editable inline." },
];

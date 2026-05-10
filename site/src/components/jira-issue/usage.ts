export const usage = `import { JiraIssue } from "@/components/agent-ui/jira-issue";

<JiraIssue
  intent={{
    project: { key: "PLAT", name: "Platform Infrastructure" },
    issueType: "Bug",
    title: agentDraft.summary,
    description: agentDraft.body,
    priority: "Highest",
    labels: ["performance", "p0"],
    sprint: "Sprint 47",
    storyPoints: 3,
    assignee: { name: "Priya Raman" },
    reporter: { name: "Atlas Agent" },
  }}
  onResult={(r) => r.kind === "submit" || r.kind === "edit"
    ? jira.issues.create(r.payload)
    : agent.continue({ skip: true })
  }
/>`;

export const props = [
  { name: "intent",    type: "JiraIssueIntent",                          req: true,  desc: "Project, issue type, title, description, priority, labels, sprint, story points, assignee, reporter." },
  { name: "onResult",  type: "(r: ReviewResult<JiraIssuePayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "issueType", type: "'Story' | 'Bug' | 'Task' | 'Epic'",        req: true,  desc: "Drives the type chip strip at the top. Editable inline." },
  { name: "priority",  type: "'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest'", req: true, desc: "Colored arrow indicators in the side panel." },
];

export const usage = `import { AsanaTask } from "@/components/agent-ui/asana-task";

<AsanaTask
  intent={{
    project: "Q3 — Platform Reliability",
    section: "Active sprint",
    title: agentDraft.title,
    description: agentDraft.body,
    dueDate: "Fri, May 16",
    assignee: { name: "Priya Raman" },
    priority: "High",
    dependencies: 2,
    customFields: [
      { name: "Service", value: "auth-gateway" },
      { name: "Effort",  value: "3 days" },
    ],
  }}
  onResult={(r) => r.kind === "submit" || r.kind === "edit"
    ? asana.tasks.create(r.payload)
    : agent.continue({ skip: true })
  }
/>`;

export const props = [
  { name: "intent",       type: "AsanaTaskIntent",                          req: true,  desc: "Project, section, title, description, due date, assignee, priority, custom fields." },
  { name: "onResult",     type: "(r: ReviewResult<AsanaTaskPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "customFields", type: "AsanaCustomField[]",                       req: false, desc: "Org-specific fields rendered as colored value chips below the description." },
];

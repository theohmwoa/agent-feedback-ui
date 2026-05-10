export const usage = `import { ClickUpTask } from "@/components/agent-ui/clickup-task";

<ClickUpTask
  intent={{
    list: "Platform — Q3 sprint board",
    space: "Engineering",
    status: "In progress",
    statusOptions: workspaceStatuses,
    name: agentDraft.title,
    description: agentDraft.body,
    priority: "Urgent",
    assignees: [{ name: "Priya Raman" }],
    watchers: [{ name: "Theophilus Homawoo" }],
    dueDate: "Fri, May 16",
    timeEstimate: "3d",
  }}
  onResult={(r) => r.kind === "submit" || r.kind === "edit"
    ? clickup.tasks.create(r.payload)
    : agent.continue({ skip: true })
  }
/>`;

export const props = [
  { name: "intent",         type: "ClickUpTaskIntent",                          req: true,  desc: "List, space, status + options, name, description, priority, assignees, watchers, due date, time estimate." },
  { name: "onResult",       type: "(r: ReviewResult<ClickUpTaskPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "statusOptions",  type: "ClickUpStatus[]",                            req: true,  desc: "Workspace-level status list. The first one is used if intent.status is unknown." },
  { name: "priority",       type: "'Urgent' | 'High' | 'Normal' | 'Low'",       req: false, desc: "Colored flag indicator. Editable via the inline picker." },
];

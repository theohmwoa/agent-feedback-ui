export const usage = `import { TrelloCard } from "@/components/agent-ui/trello-card";

<TrelloCard
  intent={{
    board: "Q3 Platform",
    list: "Doing",
    title: agentDraft.title,
    description: agentDraft.body,
    labels: [
      { name: "performance", color: "#eb5a46" },
      { name: "p0",          color: "#cf513d" },
    ],
    members: [{ name: "Priya Raman" }],
    dueDate: "Fri, May 16",
    checklist: agentChecklist,
  }}
  onResult={(r) => r.kind === "submit" || r.kind === "edit"
    ? trello.cards.create(r.payload)
    : agent.continue({ skip: true })
  }
/>`;

export const props = [
  { name: "intent",    type: "TrelloCardIntent",                          req: true,  desc: "Board, list, title, description, labels, members, due date, checklist." },
  { name: "onResult",  type: "(r: ReviewResult<TrelloCardPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "checklist", type: "TrelloChecklistItem[]",                     req: false, desc: "Editable checklist with a live progress bar above the items." },
];

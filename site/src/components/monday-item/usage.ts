export const usage = `import { MondayItem } from "@/components/agent-ui/monday-item";

<MondayItem
  intent={{
    board: "Q3 Platform Roadmap",
    group: "In progress · this sprint",
    itemName: agentDraft.title,
    columns: [
      {
        kind: "status", name: "Status", value: "Working on it",
        options: statusOptions,
      },
      { kind: "person", name: "Owner",    value: "Priya Raman" },
      { kind: "date",   name: "Deadline", value: "May 16" },
      { kind: "number", name: "Effort",   value: "3", suffix: "d" },
    ],
  }}
  onResult={(r) => r.kind === "submit" || r.kind === "edit"
    ? monday.items.create(r.payload)
    : agent.continue({ skip: true })
  }
/>`;

export const props = [
  { name: "intent",   type: "MondayItemIntent",                          req: true,  desc: "Board, group, item name, list of columns (status / person / date / number / text)." },
  { name: "onResult", type: "(r: ReviewResult<MondayItemPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "columns",  type: "MondayColumn[]",                            req: true,  desc: "Render order matches array order. Status columns get an inline pill picker." },
];

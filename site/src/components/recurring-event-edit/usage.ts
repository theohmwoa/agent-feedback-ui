export const usage = `import { RecurringEventEdit } from "@/components/agent-ui/recurring-event-edit";

<RecurringEventEdit
  intent={{
    title: "Engineering standup",
    occurrence: "2026-05-19T09:30",
    series: "Weekly · every Monday at 9:30 AM",
    totalOccurrences: 26,
    changes: [
      { field: "Time",     before: "9:30 AM", after: "10:00 AM" },
      { field: "Duration", before: "30 min",  after: "20 min" },
    ],
    defaultScope: "following",
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      gcal.events.update({ scope: r.payload.scope, changes: r.payload.changes });
    }
  }}
/>`;

export const props = [
  { name: "intent",    type: "RecurringIntent",                            req: true,  desc: "Title, current occurrence, series description, total occurrences count, the proposed changes." },
  { name: "onResult",  type: "(r: ReviewResult<RecurringPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'. 'edit' means the user changed scope." },
  { name: "changes",   type: "RecurringChange[]",                          req: true,  desc: "Each change is { field, before, after } strings. Rendered as a strikethrough → arrow → new value." },
];

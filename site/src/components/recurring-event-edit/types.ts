import type { AgentMeta } from "../../types";

export type RecurringScope = "this" | "following" | "all";

export type RecurringChange = {
  field: string;
  before: string;
  after: string;
};

export type RecurringIntent = AgentMeta & {
  title: string;
  occurrence: string;
  series: string;
  totalOccurrences: number;
  changes: RecurringChange[];
  defaultScope?: RecurringScope;
};

export type RecurringPayload = {
  scope: RecurringScope;
  changes: RecurringChange[];
  affectedOccurrences: number;
};

export const RECURRING_DEFAULT: RecurringIntent = {
  agent: "atlas",
  action: "edit-recurring",
  title: "Engineering standup",
  occurrence: "Mon, May 19 · 9:30 AM",
  series: "Weekly · every Monday at 9:30 AM",
  totalOccurrences: 26,
  changes: [
    { field: "Time",     before: "9:30 AM",                  after: "10:00 AM" },
    { field: "Duration", before: "30 min",                   after: "20 min" },
    { field: "Location", before: "Conference room A",        after: "Zoom — see link" },
  ],
  defaultScope: "following",
  rationale: "Detected three accepted edits in your last response — time, duration, and the conference room change. Bundled them into one update.",
};

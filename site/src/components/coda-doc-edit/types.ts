import type { AgentMeta } from "../../types";

export type CodaEditKind = "row-insert" | "formula-change" | "page-create" | "row-update" | "column-add";

export type CodaEdit = {
  kind: CodaEditKind;
  target: string;     // e.g. "Pipeline / Active deals"
  detail: string;     // human-readable description
  affectedRows?: number;
};

export type CodaIntent = AgentMeta & {
  doc: string;
  section: string;
  edits: CodaEdit[];
  shareWithWorkspace?: boolean;
};

export type CodaPayload = {
  doc: string;
  section: string;
  edits: CodaEdit[];
  shareWithWorkspace: boolean;
};

export const CODA_DEFAULT: CodaIntent = {
  agent: "atlas",
  action: "edit-coda",
  doc: "Q3 GTM tracker",
  section: "Pipeline",
  edits: [
    { kind: "row-insert",     target: "Pipeline / Active deals",  detail: "Insert row: Acme Corp · $48k · stage Negotiation · owner Lena", affectedRows: 1 },
    { kind: "formula-change", target: "Pipeline / weighted_value", detail: "Change formula from [Value] * [Probability] to [Value] * [Probability] * [Discount]" },
    { kind: "row-update",     target: "Pipeline / Active deals",  detail: "Update 2 deals: stage Discovery → Demo", affectedRows: 2 },
    { kind: "page-create",    target: "Pipeline / Acme",          detail: "New subpage: Acme Corp — onboarding plan, with kickoff meeting card embed" },
  ],
  shareWithWorkspace: true,
  rationale: "Pulled the Acme stage transition + the discount formula change from the deal-review meeting transcript.",
};

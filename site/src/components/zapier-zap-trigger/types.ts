import type { AgentMeta } from "../../types";

export type ZapField = {
  name: string;
  label: string;
  value: string;
  required?: boolean;
};

export type ZapStep = {
  app: string;
  appShort: string;
  appColor: string;
  action: string;
};

export type ZapierIntent = AgentMeta & {
  zapTitle: string;
  zapId: string;
  trigger: ZapStep;
  outcome: ZapStep;
  fields: ZapField[];
  skipFilters?: boolean;
  lastRunAt?: string;
  lastRunStatus?: "success" | "filtered" | "error";
};

export type ZapierPayload = {
  zapId: string;
  fields: Record<string, string>;
  skipFilters: boolean;
};

export const ZAPIER_DEFAULT: ZapierIntent = {
  agent: "atlas",
  action: "zapier-trigger",
  zapTitle: "New invoice → notify finance + add row to sheet",
  zapId: "162847291",
  trigger: {
    app: "Stripe",
    appShort: "St",
    appColor: "oklch(0.66 0.18 290)",
    action: "Manual run · invoice.created",
  },
  outcome: {
    app: "Google Sheets",
    appShort: "Gs",
    appColor: "oklch(0.74 0.13 145)",
    action: "Append row to Q3 Invoices",
  },
  fields: [
    { name: "invoice_id",     label: "Invoice ID",       value: "in_1NxcRH9BoP",           required: true },
    { name: "customer_email", label: "Customer email",   value: "billing@northwind.dev",   required: true },
    { name: "amount_total",   label: "Amount (cents)",   value: "199900",                  required: true },
    { name: "currency",       label: "Currency",         value: "USD",                     required: true },
    { name: "memo",           label: "Memo (optional)",  value: "Annual contract renewal" },
  ],
  skipFilters: false,
  lastRunAt: "2 hours ago",
  lastRunStatus: "success",
  rationale: "Customer just paid the renewal invoice. Sending it through the Q3 reporting pipeline so finance has the row before EOD.",
};

import type { AgentMeta } from "../../types";

export type SalesforceFieldChange = {
  field: string;
  label: string;
  before: string;
  after: string;
};

export type SalesforceValidation = {
  rule: string;
  level: "warn" | "block";
};

export type SalesforceAccountIntent = AgentMeta & {
  accountId: string;
  accountName: string;
  industry?: string;
  type?: string;
  changes: SalesforceFieldChange[];
  owner: { name: string; role?: string; email: string };
  validations?: SalesforceValidation[];
  requiredMissing?: string[];
};

export type SalesforceAccountPayload = {
  accountId: string;
  changes: SalesforceFieldChange[];
};

export const SALESFORCE_DEFAULT: SalesforceAccountIntent = {
  agent: "atlas",
  action: "update-account",
  accountId: "001Hu00003kPm4QIAS",
  accountName: "Acme Logistics, Inc.",
  industry: "Transportation",
  type: "Customer — Direct",
  changes: [
    { field: "Industry",    label: "Industry",     before: "Transportation",    after: "Logistics & Supply Chain" },
    { field: "AnnualRevenue", label: "Annual Revenue", before: "$24,000,000", after: "$31,500,000" },
    { field: "NumberOfEmployees", label: "Employees", before: "180", after: "245" },
    { field: "Type",        label: "Type",         before: "Customer — Direct", after: "Customer — Channel" },
  ],
  owner: { name: "Priya Raman", role: "Senior AE", email: "priya@nordlight.com" },
  validations: [
    { rule: "Annual revenue must match latest 10-Q filing", level: "warn" },
  ],
  requiredMissing: [],
  rationale: "Pulled the new revenue + employee count from Acme's Q2 earnings call this morning. Type change reflects the partner agreement signed last Tuesday.",
};

import type { AgentMeta } from "../../types";

export type CloseLeadStatus = {
  id: string;
  label: string;
  type: "active" | "won" | "lost" | "potential";
};

export type CloseCustomField = {
  key: string;
  label: string;
  value: string;
  kind: "text" | "number" | "url" | "date";
};

export type CloseLeadIntent = AgentMeta & {
  leadId: string;
  companyName: string;
  description?: string;
  url?: string;
  statuses: CloseLeadStatus[];
  currentStatusId: string;
  proposedStatusId: string;
  lastActivity: string;
  opportunitiesCount: number;
  opportunitiesValueCents: number;
  currency: string;
  address?: {
    line1: string;
    city: string;
    state: string;
    country: string;
  };
  customFields: CloseCustomField[];
};

export type CloseLeadPayload = {
  leadId: string;
  statusId: string;
  customFields: { key: string; value: string }[];
};

export const CLOSE_LEAD_DEFAULT: CloseLeadIntent = {
  agent: "atlas",
  action: "update-lead",
  leadId: "lead_8jh2k1",
  companyName: "Veridian Health Systems",
  description: "Mid-market hospital network, 12 facilities across NE.",
  url: "veridianhealth.com",
  statuses: [
    { id: "potential", label: "Potential",        type: "potential" },
    { id: "qualified", label: "Qualified",        type: "active" },
    { id: "contacted", label: "Contacted",        type: "active" },
    { id: "demo",      label: "Demo scheduled",   type: "active" },
    { id: "negotiation", label: "In negotiation", type: "active" },
    { id: "won",       label: "Won",              type: "won" },
    { id: "lost",      label: "Lost",             type: "lost" },
  ],
  currentStatusId: "contacted",
  proposedStatusId: "demo",
  lastActivity: "Inbound email — 4h ago",
  opportunitiesCount: 3,
  opportunitiesValueCents: 8650000,
  currency: "USD",
  address: {
    line1: "44 Beacon St",
    city: "Boston",
    state: "MA",
    country: "United States",
  },
  customFields: [
    { key: "ehr_system",       label: "EHR system",          value: "Epic",      kind: "text" },
    { key: "facility_count",   label: "Facility count",      value: "12",        kind: "number" },
    { key: "champion_role",    label: "Champion role",       value: "CIO",       kind: "text" },
    { key: "rfp_response_url", label: "RFP response",        value: "https://docs.veridian.com/rfp-2026.pdf", kind: "url" },
  ],
  rationale: "Got the demo confirmation email — moving status from contacted → demo scheduled. Champion role updated based on the new signature line.",
};

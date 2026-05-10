import type { AgentMeta } from "../../types";

export type HubspotPipelineStage = {
  id: string;
  label: string;
  probability: number;
};

export type HubspotDealContact = {
  email: string;
  name: string;
  primary?: boolean;
};

export type HubspotDealType = "newbusiness" | "existingbusiness";

export type HubspotDealIntent = AgentMeta & {
  pipelineId: string;
  pipelineLabel: string;
  stages: HubspotPipelineStage[];
  stageId: string;
  dealName: string;
  amountCents: number;
  currency: string;
  closeDate: string;
  dealType: HubspotDealType;
  contacts: HubspotDealContact[];
  associatedCompany?: string;
};

export type HubspotDealPayload = {
  pipelineId: string;
  stageId: string;
  dealName: string;
  amountCents: number;
  currency: string;
  closeDate: string;
  dealType: HubspotDealType;
  primaryContactEmail?: string;
  contactEmails: string[];
};

export const HUBSPOT_DEAL_DEFAULT: HubspotDealIntent = {
  agent: "atlas",
  action: "create-deal",
  pipelineId: "default",
  pipelineLabel: "Sales pipeline",
  stages: [
    { id: "appointmentscheduled", label: "Appointment scheduled", probability: 0.2 },
    { id: "qualifiedtobuy",       label: "Qualified to buy",       probability: 0.4 },
    { id: "presentationscheduled", label: "Presentation scheduled", probability: 0.6 },
    { id: "decisionmakerboughtin", label: "Decision maker bought-in", probability: 0.8 },
    { id: "contractsent",          label: "Contract sent",          probability: 0.9 },
    { id: "closedwon",             label: "Closed won",             probability: 1.0 },
  ],
  stageId: "qualifiedtobuy",
  dealName: "Nordlight Studio — Platform tier",
  amountCents: 4800000,
  currency: "USD",
  closeDate: "2026-07-31",
  dealType: "newbusiness",
  contacts: [
    { email: "maya.okafor@nordlight.studio",    name: "Maya Okafor", primary: true },
    { email: "kai.wang@nordlight.studio",       name: "Kai Wang" },
    { email: "priya.raman@nordlight.studio",    name: "Priya Raman" },
  ],
  associatedCompany: "Nordlight Studio",
  rationale: "Maya replied to the proposal asking for a contract draft — flagging the deal as qualified-to-buy at the value she quoted ($48k ARR).",
};

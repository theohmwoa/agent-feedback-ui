import type { AgentMeta } from "../../types";

export type HubspotPropertyChange = {
  property: string;
  label: string;
  before: string;
  after: string;
};

export type HubspotLifecycleStage =
  | "subscriber" | "lead" | "marketingqualifiedlead"
  | "salesqualifiedlead" | "opportunity" | "customer" | "evangelist";

export type HubspotContactIntent = AgentMeta & {
  contactId: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle?: string;
  company?: string;
  lifecycleStage: HubspotLifecycleStage;
  changes: HubspotPropertyChange[];
  associatedDeals: number;
  associatedCompanies: number;
  logActivity?: boolean;
};

export type HubspotContactPayload = {
  contactId: string;
  changes: HubspotPropertyChange[];
  logActivity: boolean;
};

export const HUBSPOT_CONTACT_DEFAULT: HubspotContactIntent = {
  agent: "atlas",
  action: "update-contact",
  contactId: "104881223",
  firstName: "Maya",
  lastName: "Okafor",
  email: "maya.okafor@nordlight.studio",
  jobTitle: "VP Engineering",
  company: "Nordlight Studio",
  lifecycleStage: "salesqualifiedlead",
  changes: [
    { property: "lifecyclestage", label: "Lifecycle stage", before: "salesqualifiedlead", after: "opportunity" },
    { property: "jobtitle",       label: "Job title",       before: "Director, Engineering", after: "VP Engineering" },
    { property: "phone",          label: "Phone",           before: "—", after: "+1 (415) 555-0148" },
    { property: "linkedin_url",   label: "LinkedIn URL",    before: "—", after: "linkedin.com/in/mayaokafor" },
  ],
  associatedDeals: 2,
  associatedCompanies: 1,
  logActivity: true,
  rationale: "Maya was promoted (per LinkedIn), and our active deal moved to the demo stage — bumping her lifecycle to opportunity to match.",
};

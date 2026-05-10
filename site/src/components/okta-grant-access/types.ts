import type { AgentMeta } from "../../types";

export type OktaIntent = AgentMeta & {
  user: {
    name: string;
    email: string;
    department?: string;
    currentGroups: string[];
  };
  application: string;
  appLogo?: string;
  groupOrRole: string;
  groupKind?: "group" | "role";
  expiresAt?: string;
  defaultExpires?: string;
  requestId?: string;
  requestUrl?: string;
  defaultJustification?: string;
  expandsAccess?: boolean;
};

export type OktaPayload = {
  userEmail: string;
  application: string;
  groupOrRole: string;
  expiresAt?: string;
  justification: string;
};

export const OKTA_DEFAULT: OktaIntent = {
  agent: "atlas",
  action: "grant-access",
  user: {
    name: "Maya Okafor",
    email: "maya.okafor@nordlight.studio",
    department: "Eng / Platform",
    currentGroups: ["eng-all", "auth-readonly", "datadog-viewer"],
  },
  application: "AWS SSO — Production",
  groupOrRole: "auth-gateway-admin",
  groupKind: "role",
  defaultExpires: "in 7 days",
  requestId: "REQ-2891",
  requestUrl: "https://nordlight.atlassian.net/servicedesk/customer/portal/3/REQ-2891",
  defaultJustification: "Maya is shadowing on the auth-gateway oncall rotation and needs admin to investigate the JWT cache regression. Time-boxed to the duration of her rotation.",
  expandsAccess: true,
  rationale: "Linked to ticket REQ-2891. Maya's existing groups include auth-readonly; this is a temporary elevation tied to her oncall shadow.",
};

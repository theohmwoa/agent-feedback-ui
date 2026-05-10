import type { AgentMeta } from "../../types";

export type SpStatus = "investigating" | "identified" | "monitoring" | "resolved";
export type SpImpact = "none" | "minor" | "major" | "critical";

export type SpComponent = {
  id: string;
  name: string;
  selected?: boolean;
};

export type SpIntent = AgentMeta & {
  pageId: string;
  pageName: string;
  title: string;
  status: SpStatus;
  impact: SpImpact;
  components: SpComponent[];
  message: string;
  defaultNotify?: boolean;
  subscriberCount?: number;
};

export type SpPayload = {
  pageId: string;
  title: string;
  status: SpStatus;
  impact: SpImpact;
  componentIds: string[];
  message: string;
  notifySubscribers: boolean;
};

export const SP_DEFAULT: SpIntent = {
  agent: "atlas",
  action: "create-incident",
  pageId: "8d2hxtr1qf3z",
  pageName: "Nordlight Status",
  title: "Elevated latency on auth gateway",
  status: "investigating",
  impact: "major",
  components: [
    { id: "auth",   name: "Authentication",  selected: true  },
    { id: "api",    name: "REST API",        selected: true  },
    { id: "ws",     name: "Websockets",      selected: false },
    { id: "search", name: "Search",          selected: false },
    { id: "files",  name: "File uploads",    selected: false },
    { id: "web",    name: "Dashboard",       selected: false },
  ],
  message: `We're investigating elevated latency on the auth gateway affecting login and authenticated API calls. Customers may experience slower response times or intermittent timeouts. We'll post an update within 15 minutes.`,
  defaultNotify: true,
  subscriberCount: 4287,
  rationale: "Datadog p99 over 800ms for 5+ min on auth-gateway. Drafted message based on the incident-template you tagged as preferred.",
};

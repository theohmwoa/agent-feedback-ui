import type { AgentMeta } from "../../types";

export type SentryResolveType = "now" | "next-release" | "in-commit" | "in-version";

export type SentryAssignee = { name: string; email: string };

export type SentryIntent = AgentMeta & {
  issueId: string;
  shortId: string;
  title: string;
  errorType: string;
  project: string;
  environment?: string;
  lastSeen: string;
  occurrences: number;
  usersAffected?: number;
  defaultResolveType?: SentryResolveType;
  defaultVersion?: string;
  assignees?: SentryAssignee[];
  defaultAssignee?: SentryAssignee;
};

export type SentryPayload = {
  issueId: string;
  resolveType: SentryResolveType;
  version?: string;
  assignee?: string;
  reminderIfRecurs: boolean;
};

export const SENTRY_DEFAULT: SentryIntent = {
  agent: "atlas",
  action: "resolve-issue",
  issueId: "5398214711",
  shortId: "AUTH-GATEWAY-J4F",
  title: "TypeError: Cannot read properties of undefined (reading 'kid')",
  errorType: "TypeError",
  project: "auth-gateway",
  environment: "production",
  lastSeen: "2 min ago",
  occurrences: 1842,
  usersAffected: 219,
  defaultResolveType: "in-commit",
  defaultVersion: "v3.4.2",
  assignees: [
    { name: "Priya Raman",   email: "priya@nordlight.studio" },
    { name: "Marco Chen",    email: "marco@nordlight.studio" },
    { name: "Eli Vasquez",   email: "eli@nordlight.studio" },
  ],
  defaultAssignee: { name: "Priya Raman", email: "priya@nordlight.studio" },
  rationale: "PR #4187 lands a `kid` null guard in the JWT path. Resolve in commit so this auto-reopens if the fix doesn't actually stop the error.",
};

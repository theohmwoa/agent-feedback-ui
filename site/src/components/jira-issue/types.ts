import type { AgentMeta } from "../../types";

export type JiraIssueType = "Story" | "Bug" | "Task" | "Epic";
export type JiraPriority = "Highest" | "High" | "Medium" | "Low" | "Lowest";

export type JiraIssueIntent = AgentMeta & {
  project: { key: string; name: string };
  issueType: JiraIssueType;
  title: string;
  description: string;
  priority: JiraPriority;
  labels: string[];
  sprint?: string;
  storyPoints?: number;
  assignee: { name: string; email?: string };
  reporter: { name: string; email?: string };
  components?: string[];
};

export type JiraIssuePayload = {
  projectKey: string;
  issueType: JiraIssueType;
  title: string;
  description: string;
  priority: JiraPriority;
  labels: string[];
  sprint?: string;
  storyPoints?: number;
  assignee: string;
};

export const JIRA_ISSUE_DEFAULT: JiraIssueIntent = {
  agent: "atlas",
  action: "create-jira-issue",
  project: { key: "PLAT", name: "Platform Infrastructure" },
  issueType: "Bug",
  title: "Auth gateway hot-path: synchronous JWT verify blocks event loop",
  description: `*Steps to reproduce*
# Run \`ab -n 5000 -c 50 https://auth.nordlight.cloud/verify\`
# Observe p99 latency > 800ms after the May 10 deploy

*Root cause*
\`@nl/jwt\` calls \`crypto.verify\` synchronously per request without caching the public key.

*Fix candidate*
Module-scoped LRU keyed by \`kid\` (32 entries, 1h TTL). Patch ready in pull request #4187.`,
  priority: "Highest",
  labels: ["performance", "auth-gateway", "p0"],
  sprint: "Sprint 47 — May 6 to May 19",
  storyPoints: 3,
  assignee: { name: "Priya Raman", email: "priya.raman@nordlight.studio" },
  reporter: { name: "Atlas Agent", email: "atlas@nordlight.studio" },
  components: ["auth-gateway", "core-libs"],
  rationale: "Picked up the active incident in #eng-platform; Priya is the on-call. Pre-filled the description from the PR you reviewed.",
};

export const usage = `import { SentryResolve } from "@/components/agent-ui/sentry-resolve";

<SentryResolve
  intent={{
    issueId: issue.id,
    shortId: issue.shortId,
    title: issue.title,
    errorType: issue.metadata.type,
    project: issue.project.slug,
    environment: "production",
    lastSeen: formatRelative(issue.lastSeen),
    occurrences: issue.count,
    usersAffected: issue.userCount,
    defaultResolveType: "in-commit",
    defaultVersion: latestRelease,
    assignees: teamMembers,
  }}
  onResult={async (r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      await sentry.updateIssue(r.payload.issueId, {
        status: "resolved",
        statusDetails: resolveDetailsFor(r.payload),
        assignedTo: r.payload.assignee,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",                type: "SentryIntent",                            req: true,  desc: "Issue id, title, error type, occurrences, users affected, project, env." },
  { name: "onResult",              type: "(r: ReviewResult<SentryPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.defaultResolveType", type: "'now' | 'next-release' | 'in-commit' | 'in-version'", req: false, desc: "Pre-selected resolve mode." },
  { name: "intent.assignees",      type: "SentryAssignee[]",                        req: false, desc: "Team members the issue can be assigned to." },
];

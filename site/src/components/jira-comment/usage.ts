export const usage = `import { JiraComment } from "@/components/agent-ui/jira-comment";

<JiraComment
  intent={{
    issue: { key: "PLAT-241", summary, status: "In Progress" },
    priorComments: latestTwo,
    body: agentDraft,
    mentions: ["@priya", "@joaquim"],
    internal: false,
  }}
  onResult={(r) => r.kind === "submit" || r.kind === "edit"
    ? jira.issues.addComment(r.payload)
    : agent.continue({ skip: true })
  }
/>`;

export const props = [
  { name: "intent",        type: "JiraCommentIntent",                          req: true,  desc: "Issue summary card, prior comments preview, body, mentions, internal toggle." },
  { name: "onResult",      type: "(r: ReviewResult<JiraCommentPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "priorComments", type: "JiraComment[]",                              req: true,  desc: "Pass the most recent ~2 to give the user thread context. Scrollable above 3." },
  { name: "internal",      type: "boolean",                                    req: false, desc: "If true, the comment posts as an internal-only note." },
];

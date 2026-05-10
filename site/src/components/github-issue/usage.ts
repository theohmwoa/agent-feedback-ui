export const usage = `import { GithubIssue } from "@/components/agent-ui/github-issue";

<GithubIssue
  intent={{
    repo: "nordlight/api-gateway",
    title: agentDraft.title,
    body: agentDraft.body,
    labels: [{ name: "bug", color: "#d73a4a" }],
    assignees: ["priyaraman"],
    milestone: "v3.4",
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      octokit.issues.create({ owner, repo, ...r.payload });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "GithubIssueIntent",                            req: true,  desc: "Repo, title, body, labels, assignees, milestone, template." },
  { name: "onResult", type: "(r: ReviewResult<GithubIssuePayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
];

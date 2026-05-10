export const usage = `import { GitCommitMessage } from "@/components/agent-ui/git-commit-message";

<GitCommitMessage
  intent={{
    branch: "feat/billing-retries",
    authorName: "Theo Homawoo",
    authorEmail: "theo@northwind.dev",
    files: stagedFiles,        // [{ path, added, deleted, status }]
    type: "fix",
    scope: "stripe",
    subject: agentSubject,
    body: agentBody,
    amend: false,
    signoff: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      execSync(\`git commit \${r.payload.amend ? "--amend " : ""}-m \${shellQuote(r.payload.message)}\`);
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "CommitIntent",                            req: true,  desc: "Branch, author, staged files, type, scope, subject, body, amend/signoff." },
  { name: "onResult", type: "(r: ReviewResult<CommitPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'. payload.message is the full conventional-commit string." },
  { name: "intent.type", type: "CommitType",                          req: true,  desc: "feat | fix | docs | refactor | perf | test | chore | build | ci | style | revert" },
];

export const usage = `import { ConfluencePage } from "@/components/agent-ui/confluence-page";

<ConfluencePage
  intent={{
    space: "ENG",
    parentBreadcrumb: ["Engineering", "Runbooks"],
    title: "Auth gateway runbook",
    body: agentBody,
    labels: ["runbook", "auth-gateway"],
    restriction: "open",
    watchers: 7,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      confluence.content.update({ ...r.payload });
    }
  }}
/>`;

export const props = [
  { name: "intent",      type: "ConfluenceIntent",                            req: true,  desc: "Space, parent breadcrumb, title, body, labels, restriction, watchers." },
  { name: "onResult",    type: "(r: ReviewResult<ConfluencePayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "restriction", type: "'open' | 'read-only' | 'private'",            req: false, desc: "Page-level access. Defaults to 'open'." },
];

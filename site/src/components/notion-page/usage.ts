export const usage = `import { NotionPage } from "@/components/agent-ui/notion-page";

<NotionPage
  intent={{
    workspace: "Nordlight",
    parent: "Engineering / Postmortems",
    title: postmortemTitle,
    blocks: agentBlocks,
    properties: [
      { name: "Status",   type: "select", value: "Resolved" },
      { name: "Severity", type: "select", value: "P1" },
    ],
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      notion.pages.create({ parent, properties, children: blocksToBlocks(r.payload.blocks) });
    }
  }}
/>`;

export const props = [
  { name: "intent",    type: "NotionIntent",                            req: true,  desc: "Workspace, parent path, title, blocks, properties." },
  { name: "onResult",  type: "(r: ReviewResult<NotionPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "blocks",    type: "NotionBlock[]",                           req: true,  desc: "Heading / paragraph / bullet / todo / code blocks. Each editable inline." },
];

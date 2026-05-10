export const usage = `import { SlackMessage } from "@/components/agent-ui/slack-message";

<SlackMessage
  intent={{
    workspace: "nordlight",
    channel: "eng-platform",
    thread: { parent, replies: 4 },
    mentions: ["@priya", "@on-call"],
    message: draftFromAgent,
  }}
  onResult={(r) => {
    if (r.kind === "submit") postToSlack(r.payload);
    if (r.kind === "cancel") agent.abort();
  }}
/>`;

export const props = [
  { name: "intent",   type: "SlackIntent",                          req: true,  desc: "Workspace, channel, thread parent, draft message, mentions." },
  { name: "onResult", type: "(r: ReviewResult<SlackPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "thread",   type: "{ parent, replies }",                  req: false, desc: "If present, renders parent context above the composer." },
];

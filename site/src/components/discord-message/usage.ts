export const usage = `import { DiscordMessage } from "@/components/agent-ui/discord-message";

<DiscordMessage
  intent={{
    target: { kind: "channel", server: "Northwind Devs", channel: "release-notes" },
    message: agentDraft,
    mentions: ["@priya", "@jchen"],
    attachment: { name: "release-notes.md", size: "4.1 KB" },
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") postToDiscord(r.payload);
  }}
/>`;

export const props = [
  { name: "intent",   type: "DiscordIntent",                            req: true,  desc: "Target (channel or DM), message body, mention list, optional attachment." },
  { name: "onResult", type: "(r: ReviewResult<DiscordPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "target",   type: "{ kind: 'channel' | 'dm', ... }",          req: true,  desc: "Channel target needs server + channel; DM needs user + userHandle." },
];

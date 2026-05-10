export const usage = `import { DiscordEmbed } from "@/components/agent-ui/discord-embed";

<DiscordEmbed
  intent={{
    channel: "release-notes",
    title: "v3.4.0 — auth-gateway hot-fix",
    description: agentDescription,
    color: "#9b6cff",
    fields: [
      { name: "PR", value: "#4187", inline: true },
      { name: "Author", value: "@priya", inline: true },
    ],
    thumbnailUrl,
    footerText: "Northwind • CI build #4419",
    author: { name: "Atlas (release bot)" },
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      discord.channels.send(channelId, { embeds: [r.payload.embed] });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "DiscordEmbedIntent",                            req: true,  desc: "Channel, title, description, color, fields[], thumbnailUrl, footerText, author." },
  { name: "onResult", type: "(r: ReviewResult<DiscordEmbedPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "color",    type: "string",                                        req: true,  desc: "CSS color used for the embed accent rail. Pick from the swatch row or set any oklch/hex." },
];

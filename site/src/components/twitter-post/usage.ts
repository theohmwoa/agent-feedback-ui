export const usage = `import { TwitterPost } from "@/components/agent-ui/twitter-post";

<TwitterPost
  intent={{
    handle: "@nordlight_eng",
    displayName: "Nordlight Engineering",
    body: agentDraft,
    audience: "everyone",
    media: [{ kind: "image", alt: "p99 graph" }],
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      twitter.tweets.create({
        text: r.payload.body,
        media_ids: uploadedMediaIds,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "TwitterIntent",                            req: true,  desc: "Author handle + display name, body text, audience, media, optional poll/schedule/replyingTo." },
  { name: "onResult", type: "(r: ReviewResult<TwitterPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "audience", type: "'everyone' | 'circle' | 'followers'",      req: false, desc: "Click the audience pill in the composer to cycle through values." },
];

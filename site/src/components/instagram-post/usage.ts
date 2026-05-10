export const usage = `import { InstagramPost } from "@/components/agent-ui/instagram-post";

<InstagramPost
  intent={{
    handle: "@theohmwoa",
    imageAlt: "studio desk · monitor showing latency graph",
    caption: agentCaption,
    hashtags: ["studiolife", "buildinpublic"],
    location: "San Francisco, CA",
    audience: "public",
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      instagram.media.publish({
        caption: r.payload.caption + " " + r.payload.hashtags.map(h => "#" + h).join(" "),
        location: r.payload.location,
        audience: r.payload.audience,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "InstagramIntent",                            req: true,  desc: "Handle, image preview hue/alt, caption, hashtag chips, location, audience, share-to-Facebook." },
  { name: "onResult", type: "(r: ReviewResult<InstagramPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "audience", type: "'public' | 'close-friends'",                 req: false, desc: "Toggle in the footer flips between public + close-friends with a colored dot affordance." },
];

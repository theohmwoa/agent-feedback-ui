export const usage = `import { LinkedInPost } from "@/components/agent-ui/linkedin-post";

<LinkedInPost
  intent={{
    profile: { name: "Theophilus Homawoo", headline: "Building agent infra @ Nordlight" },
    audience: "anyone",
    body: agentDraft,
    hashtags: ["distributedSystems", "performance"],
    media: [{ kind: "image", alt: "p99 graph" }],
    shareToCompanies: ["Nordlight"],
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      linkedin.posts.create({
        text: r.payload.body,
        visibility: r.payload.audience,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "LinkedInIntent",                            req: true,  desc: "Profile card, body, audience, hashtags, media tiles, optional share-to-companies." },
  { name: "onResult", type: "(r: ReviewResult<LinkedInPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "audience", type: "'anyone' | 'connections' | 'group'",        req: false, desc: "Click the small audience pill in the profile card to cycle through values." },
];

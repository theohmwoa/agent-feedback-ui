export const usage = `import { RedditPost } from "@/components/agent-ui/reddit-post";

<RedditPost
  intent={{
    subreddit: "r/programming",
    subscribers: 6_400_000,
    rulesUrl: "https://reddit.com/r/programming/about/rules",
    kind: "text",
    title: agentTitle,
    body: agentBody,
    flair: { name: "Practical Engineering" },
    availableFlair: subFlair,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      reddit.submit({
        sr: r.payload.subreddit,
        kind: r.payload.kind,
        title: r.payload.title,
        text: r.payload.body,
        url: r.payload.url,
        flair_id: r.payload.flair?.name,
        nsfw: r.payload.nsfw,
        spoiler: r.payload.spoiler,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",         type: "RedditIntent",                           req: true,  desc: "Subreddit, subscribers, rules URL, post kind, title, body/url, flair set, NSFW + spoiler defaults." },
  { name: "onResult",       type: "(r: ReviewResult<RedditPostPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "availableFlair", type: "RedditFlair[]",                          req: false, desc: "If provided, the chip-row picker lets the user switch flair before submitting." },
];

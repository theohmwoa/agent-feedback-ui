export const usage = `import { RedditComment } from "@/components/agent-ui/reddit-comment";

<RedditComment
  intent={{
    subreddit: "r/programming",
    parent: {
      author: "u/distributed_dan",
      score: 142,
      age: "3h",
      body: parentCommentBody,
      distinguished: "op",
    },
    reply: agentDraft,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      reddit.comment({
        parent: parentId,
        text: r.payload.reply,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "RedditCommentIntent",                            req: true,  desc: "Subreddit, parent comment (author, score, body, age, optional distinguished badge), draft reply." },
  { name: "onResult", type: "(r: ReviewResult<RedditCommentPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "parent.distinguished", type: "'op' | 'mod' | 'admin'",            req: false, desc: "Renders the small colored badge next to the username." },
];

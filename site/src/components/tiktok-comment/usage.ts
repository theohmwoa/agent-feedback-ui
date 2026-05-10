export const usage = `import { TiktokComment } from "@/components/agent-ui/tiktok-comment";

<TiktokComment
  intent={{
    video: {
      creator: "@codecanyon",
      creatorVerified: true,
      description: videoDesc,
      sound: "original sound · @codecanyon",
      views: 412_300,
    },
    replyingTo: { author: "@bytebakery", text: "what was the actual fix tho" },
    comment: agentDraft,
    isCreator: false,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      tiktok.comments.create({
        video_id: videoId,
        text: r.payload.comment,
        pin: r.payload.pin,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",     type: "TiktokIntent",                            req: true,  desc: "Video card (creator + verified, description, sound, views), optional reply-to, draft, creator flag, pin." },
  { name: "onResult",   type: "(r: ReviewResult<TiktokPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "isCreator",  type: "boolean",                                 req: false, desc: "When true, footer surfaces a 'pin to top of comments' toggle that's otherwise hidden." },
];

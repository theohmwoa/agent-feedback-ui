export const usage = `import { TelegramMessage } from "@/components/agent-ui/telegram-message";

<TelegramMessage
  intent={{
    target: { kind: "channel", name: "Build Status", subscribers: 482 },
    message: agentDraft,
    silent: false,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      telegramBot.sendMessage(channelId, r.payload.message, {
        disable_notification: r.payload.silent,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "TelegramIntent",                            req: true,  desc: "Target (channel or user), message body, optional schedule + silent flag." },
  { name: "onResult", type: "(r: ReviewResult<TelegramPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "silent",   type: "boolean",                                   req: false, desc: "If true, send without push notification (useful for build status spam)." },
];

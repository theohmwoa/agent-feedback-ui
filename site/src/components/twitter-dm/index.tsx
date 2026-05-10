import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { TWITTER_DM_DEFAULT } from "./types";
import type { TwitterDmIntent, TwitterDmPayload } from "./types";

export type { TwitterDmIntent, TwitterDmPayload } from "./types";
export { TWITTER_DM_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.04 240)";

export function TwitterDm({
  intent = TWITTER_DM_DEFAULT,
  onResult,
}: {
  intent?: TwitterDmIntent;
  onResult?: (r: ReviewResult<TwitterDmPayload>) => void;
}) {
  const [message, setMessage] = React.useState(intent.message);
  const edited = message !== intent.message;
  const isRequest = !intent.recipient.followsYou;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { recipientHandle: intent.recipient.handle, message },
    summary: `DM → ${intent.recipient.handle}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "DM cancelled" });

  return (
    <ModalShell
      width={540}
      accent={ACCENT}
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)", gap: 12,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <div style={{ flex: 1 }} />
          {isRequest && <Pill tone="warn" size="sm">message request</Pill>}
          <button onClick={cancel} aria-label="Close" style={{ color: "var(--fg-dim)" }}>
            <Icon.X size={15} />
          </button>
        </div>
      }
      footer={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderTop: "1px solid var(--border)",
          background: "color-mix(in oklch, var(--bg-inset) 60%, transparent)",
          gap: 10,
        }}>
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
            DM · twitter
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            disabled={message.trim().length === 0}
            icon={<Icon.Send size={13} />}
            onClick={submit}
          >
            {edited ? "Send edited" : isRequest ? "Send request" : "Send message"}
          </Button>
        </div>
      }
    >
      {intent.rationale && (
        <div style={{
          display: "flex", gap: 10,
          padding: "12px 16px",
          background: `color-mix(in oklch, ${ACCENT} 6%, transparent)`,
          borderBottom: "1px solid var(--border-faint)",
          fontSize: 12.5, color: "var(--fg-muted)", lineHeight: 1.5,
        }}>
          <Icon.Sparkles size={14} style={{ color: ACCENT, marginTop: 2, flexShrink: 0 }} />
          <span>{intent.rationale}</span>
        </div>
      )}

      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar name={intent.recipient.displayName} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>
              {intent.recipient.displayName}
            </span>
            {intent.recipient.verified && (
              <Icon.Check size={12} style={{ color: ACCENT }} />
            )}
          </div>
          <div style={{
            fontSize: 12.5, color: "var(--fg-faint)",
            fontFamily: "var(--font-mono)",
          }}>{intent.recipient.handle}</div>
        </div>
        {intent.recipient.followsYou && (
          <Pill size="xs">follows you</Pill>
        )}
      </div>

      {intent.priorMessage && (
        <div style={{
          padding: "8px 16px 14px",
          borderTop: "1px solid var(--border-faint)",
        }}>
          <div style={{
            display: "flex",
            justifyContent: intent.priorMessage.author === "you" ? "flex-end" : "flex-start",
          }}>
            <div style={{
              maxWidth: "78%",
              background: intent.priorMessage.author === "you"
                ? ACCENT
                : "var(--bg-inset)",
              color: intent.priorMessage.author === "you"
                ? "oklch(0.18 0.02 240)"
                : "var(--fg)",
              borderRadius: intent.priorMessage.author === "you"
                ? "16px 16px 4px 16px"
                : "16px 16px 16px 4px",
              padding: "10px 14px",
              fontSize: 13.5, lineHeight: 1.5,
            }}>
              {intent.priorMessage.text}
            </div>
          </div>
          <div style={{
            marginTop: 4,
            fontSize: 10.5, color: "var(--fg-faint)",
            fontFamily: "var(--font-mono)",
            textAlign: intent.priorMessage.author === "you" ? "right" : "left",
          }}>
            {intent.priorMessage.time}
          </div>
        </div>
      )}

      <div style={{
        padding: "14px 16px",
        borderTop: "1px solid var(--border-faint)",
      }}>
        <div style={{
          display: "flex", justifyContent: "flex-end",
          marginBottom: 10,
        }}>
          <div style={{
            maxWidth: "78%",
            background: ACCENT, color: "oklch(0.18 0.02 240)",
            borderRadius: "16px 16px 4px 16px",
            padding: "10px 14px",
            fontSize: 13.5, lineHeight: 1.5,
            whiteSpace: "pre-wrap", wordBreak: "break-word",
          }}>
            {message || <span style={{ opacity: 0.5 }}>type your reply…</span>}
          </div>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "6px 10px",
          background: "var(--bg-inset)",
          border: "1px solid var(--border)",
          borderRadius: 999,
        }}>
          <button aria-label="Add image" style={{ color: ACCENT, padding: 4 }}>
            <Icon.Image size={15} />
          </button>
          <button aria-label="Add GIF" style={{
            fontFamily: "var(--font-mono)", fontWeight: 700,
            fontSize: 11, color: ACCENT, padding: "2px 6px",
            border: `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)`,
            borderRadius: 4,
          }}>
            GIF
          </button>
          <button aria-label="Add emoji" style={{ color: ACCENT, padding: 4 }}>
            <Icon.Smile size={15} />
          </button>
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Start a new message"
            style={{
              flex: 1, height: 28, padding: "0 8px",
              background: "transparent",
              border: 0, outline: 0,
              fontSize: 13.5, color: "var(--fg)",
            }}
          />
        </div>
      </div>
    </ModalShell>
  );
}

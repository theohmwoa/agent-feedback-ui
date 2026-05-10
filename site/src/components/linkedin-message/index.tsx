import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { LINKEDIN_MESSAGE_DEFAULT } from "./types";
import type { LinkedInMessageIntent, LinkedInMessagePayload } from "./types";

export type { LinkedInMessageIntent, LinkedInMessagePayload } from "./types";
export { LINKEDIN_MESSAGE_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.10 240)";

export function LinkedInMessage({
  intent = LINKEDIN_MESSAGE_DEFAULT,
  onResult,
}: {
  intent?: LinkedInMessageIntent;
  onResult?: (r: ReviewResult<LinkedInMessagePayload>) => void;
}) {
  const [message, setMessage] = React.useState(intent.message);
  const edited = message !== intent.message;
  const isInMail = !!intent.isInMail || intent.recipient.inNetwork === false;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { recipientName: intent.recipient.name, message, isInMail },
    summary: `${isInMail ? "InMail" : "Message"} → ${intent.recipient.name}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "LinkedIn message cancelled" });

  return (
    <ModalShell
      width={580}
      accent={ACCENT}
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)", gap: 12,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <div style={{ flex: 1 }} />
          {isInMail && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "2px 8px",
              fontSize: 11, fontFamily: "var(--font-mono)",
              color: ACCENT,
              background: `color-mix(in oklch, ${ACCENT} 10%, transparent)`,
              border: `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)`,
              borderRadius: 4, fontWeight: 700,
              letterSpacing: 0.4,
            }}>
              InMail
            </span>
          )}
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
            {isInMail ? "uses 1 InMail credit" : "free message"}
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
            {edited ? "Send edited" : isInMail ? "Send InMail" : "Send message"}
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

      {/* Recipient profile row */}
      <div style={{
        padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ position: "relative" }}>
          <Avatar name={intent.recipient.name} size={44} />
          {intent.recipient.online && (
            <span style={{
              position: "absolute", bottom: 0, right: 0,
              width: 10, height: 10, borderRadius: 999,
              background: "var(--c-ok)",
              border: "2px solid var(--bg-card)",
            }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{intent.recipient.name}</div>
          <div style={{
            fontSize: 12, color: "var(--fg-muted)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{intent.recipient.headline}</div>
        </div>
        {intent.recipient.inNetwork === false && (
          <Pill tone="warn" size="xs">out of network</Pill>
        )}
        {intent.recipient.inNetwork === true && (
          <Pill size="xs">2nd</Pill>
        )}
      </div>

      {intent.priorMessage && (
        <div style={{ padding: "0 16px 14px", borderTop: "1px solid var(--border-faint)", paddingTop: 12 }}>
          <div style={{ display: "flex", justifyContent: intent.priorMessage.author === "you" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "78%",
              background: intent.priorMessage.author === "you"
                ? ACCENT
                : "var(--bg-inset)",
              color: intent.priorMessage.author === "you"
                ? "oklch(0.18 0.02 240)"
                : "var(--fg)",
              borderRadius: 14,
              padding: "10px 14px",
              fontSize: 13.5, lineHeight: 1.5,
            }}>
              {intent.priorMessage.text}
            </div>
          </div>
          <div style={{
            marginTop: 4, fontSize: 10.5,
            color: "var(--fg-faint)", fontFamily: "var(--font-mono)",
            textAlign: intent.priorMessage.author === "you" ? "right" : "left",
          }}>
            {intent.priorMessage.time}
          </div>
        </div>
      )}

      {/* Composer */}
      <div style={{
        borderTop: "1px solid var(--border-faint)",
        padding: "12px 16px",
      }}>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={8}
          placeholder="Write a message…"
          style={{
            width: "100%", padding: "10px 12px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)",
            borderRadius: 10, outline: 0,
            fontSize: 13.5, fontFamily: "var(--font-sans)",
            color: "var(--fg)", lineHeight: 1.55,
            minHeight: 140, display: "block",
            resize: "vertical",
          }}
        />
        <div style={{
          marginTop: 6, display: "flex", alignItems: "center", gap: 8,
          color: "var(--fg-dim)",
        }}>
          <button aria-label="Attach document" style={{ color: "var(--fg-dim)", padding: 4 }}>
            <Icon.Paperclip size={15} />
          </button>
          <button aria-label="Image" style={{ color: "var(--fg-dim)", padding: 4 }}>
            <Icon.Image size={15} />
          </button>
          <button aria-label="GIF" style={{
            fontFamily: "var(--font-mono)", fontWeight: 700,
            fontSize: 11, color: "var(--fg-dim)", padding: "2px 6px",
            border: "1px solid var(--border)", borderRadius: 4,
          }}>GIF</button>
          <button aria-label="Emoji" style={{ color: "var(--fg-dim)", padding: 4 }}>
            <Icon.Smile size={15} />
          </button>
          <div style={{ flex: 1 }} />
          <span style={{
            fontSize: 11, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)",
          }}>
            {message.length} chars
          </span>
        </div>
      </div>
    </ModalShell>
  );
}

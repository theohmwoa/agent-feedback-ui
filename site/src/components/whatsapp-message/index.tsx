import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { WHATSAPP_DEFAULT } from "./types";
import type { WhatsappIntent, WhatsappPayload } from "./types";

export type { WhatsappIntent, WhatsappPayload } from "./types";
export { WHATSAPP_DEFAULT } from "./types";

const ACCENT = "oklch(0.74 0.16 145)";

export function WhatsappMessage({
  intent = WHATSAPP_DEFAULT,
  onResult,
}: {
  intent?: WhatsappIntent;
  onResult?: (r: ReviewResult<WhatsappPayload>) => void;
}) {
  const [message, setMessage] = React.useState(intent.message);
  const edited = message !== intent.message;
  const len = message.length;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { to: intent.to, message },
    summary: `WhatsApp → ${intent.toName ?? intent.to}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "WhatsApp send cancelled" });

  return (
    <ModalShell
      width={500}
      accent={ACCENT}
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)", gap: 12,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <div style={{ flex: 1 }} />
          {intent.templateName && (
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
              template: {intent.templateName}
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
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 11, fontFamily: "var(--font-mono)", color: ACCENT,
          }}>
            <Icon.Lock size={11} />
            end-to-end encrypted
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Send edited" : "Send WhatsApp"}
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

      {/* Contact strip */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 16px",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <Avatar name={intent.toName ?? intent.to} size={34} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {intent.toName && (
            <div style={{ fontSize: 14, fontWeight: 600 }}>{intent.toName}</div>
          )}
          <div style={{
            fontSize: 12, fontFamily: "var(--font-mono)",
            color: "var(--fg-muted)",
          }}>{intent.to}</div>
        </div>
        <span style={{
          fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--c-ok)",
          display: "inline-flex", alignItems: "center", gap: 4,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--c-ok)" }} />
          online
        </span>
      </div>

      {/* Chat preview bubble */}
      <div style={{
        padding: "16px",
        background: `repeating-linear-gradient(45deg, var(--bg-inset), var(--bg-inset) 12px, color-mix(in oklch, var(--bg-inset) 50%, var(--bg-card)) 12px, color-mix(in oklch, var(--bg-inset) 50%, var(--bg-card)) 24px)`,
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{
            maxWidth: "82%",
            background: `color-mix(in oklch, ${ACCENT} 32%, var(--bg-card))`,
            color: "var(--fg)",
            borderRadius: "10px 10px 2px 10px",
            padding: "8px 12px 6px",
            fontSize: 13.5, lineHeight: 1.45,
            whiteSpace: "pre-wrap", wordBreak: "break-word",
            boxShadow: "0 1px 2px rgb(0 0 0 / .25)",
          }}>
            {message || <span style={{ opacity: .4 }}>Type your message…</span>}
            <div style={{
              display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4,
              marginTop: 4,
              fontSize: 10, color: "var(--fg-faint)",
              fontFamily: "var(--font-mono)",
            }}>
              <span>now</span>
              <span style={{ color: ACCENT }}>✓✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Editable */}
      <div style={{ padding: "12px 16px" }}>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={3}
          placeholder="Message…"
          style={{
            width: "100%", padding: "10px 12px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 10,
            outline: 0,
            fontSize: 13.5, fontFamily: "var(--font-sans)",
            color: "var(--fg)", lineHeight: 1.5,
          }}
        />
        <div style={{
          marginTop: 6, display: "flex", alignItems: "center", gap: 12,
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
        }}>
          <span>{len} chars</span>
          {len > 4096 && <span style={{ color: "var(--c-warn)" }}>over WA limit (4096)</span>}
        </div>
      </div>
    </ModalShell>
  );
}

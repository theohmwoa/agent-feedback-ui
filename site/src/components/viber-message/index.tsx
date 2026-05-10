import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, IconButton, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { VIBER_DEFAULT } from "./types";
import type { ViberIntent, ViberPayload } from "./types";

export type { ViberIntent, ViberPayload } from "./types";
export { VIBER_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.16 290)";
const CHAR_LIMIT = 1000;

export function ViberMessage({
  intent = VIBER_DEFAULT,
  onResult,
}: {
  intent?: ViberIntent;
  onResult?: (r: ReviewResult<ViberPayload>) => void;
}) {
  const [message, setMessage] = React.useState(intent.message);
  const [viberOut, setViberOut] = React.useState(!intent.recipientOnViber);

  const edited = message !== intent.message;
  const overLimit = message.length > CHAR_LIMIT;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { to: intent.to, message, viaViberOut: viberOut },
    summary: `Viber → ${intent.toName || intent.to}${viberOut ? " (Viber Out)" : ""}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Viber message cancelled" });

  return (
    <ModalShell
      width={520}
      accent={ACCENT}
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)", gap: 12,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <div style={{ flex: 1 }} />
          {!intent.recipientOnViber && (
            <Pill tone="warn" size="sm">recipient not on Viber</Pill>
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
            {viberOut ? `Viber Out · ${intent.viberOutCost ?? "carrier-billed"}` : "Viber · free"}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Send edited" : viberOut ? "Send (Viber Out)" : "Send"}
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

      <div style={{
        padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 12,
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <Avatar name={intent.toName || intent.to} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {intent.toName && (
            <div style={{ fontWeight: 600, fontSize: 14 }}>{intent.toName}</div>
          )}
          <div style={{
            fontSize: 12, color: "var(--fg-muted)",
            fontFamily: "var(--font-mono)",
          }}>{intent.to}</div>
        </div>
        <Pill size="xs" tone={intent.recipientOnViber ? "ok" : "default"}>
          {intent.recipientOnViber ? "on Viber" : "off Viber"}
        </Pill>
      </div>

      {/* Bubble preview */}
      <div style={{
        margin: "14px 16px 12px",
        padding: "16px 14px",
        background: "var(--bg-inset)",
        border: "1px solid var(--border-faint)",
        borderRadius: 14,
      }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{
            maxWidth: "84%",
            background: ACCENT, color: "oklch(0.96 0.04 290)",
            borderRadius: "16px 16px 4px 16px",
            padding: "10px 14px",
            fontSize: 14, lineHeight: 1.45,
            whiteSpace: "pre-wrap", wordBreak: "break-word",
          }}>
            {message || <span style={{ opacity: 0.5 }}>Type your message…</span>}
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px 12px" }}>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={3}
          placeholder="Type a message…"
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
          color: overLimit ? "var(--c-warn)" : "var(--fg-faint)",
        }}>
          <span>{message.length} / {CHAR_LIMIT}</span>
        </div>
      </div>

      {/* Stickers + Viber Out toggle */}
      <div style={{
        padding: "10px 16px 14px",
        borderTop: "1px solid var(--border-faint)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{ display: "flex", gap: 4, color: "var(--fg-dim)" }}>
          <IconButton icon={<Icon.Smile size={14} />} label="sticker" />
          <IconButton icon={<Icon.Image size={14} />} label="image" />
          <IconButton icon={<Icon.Paperclip size={14} />} label="file" />
        </div>
        <div style={{ flex: 1 }} />
        <label style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontSize: 12, color: "var(--fg-muted)", cursor: "pointer",
        }}>
          <input
            type="checkbox"
            checked={viberOut}
            onChange={e => setViberOut(e.target.checked)}
            style={{ accentColor: ACCENT }}
          />
          <span>Send via Viber Out</span>
        </label>
      </div>
    </ModalShell>
  );
}

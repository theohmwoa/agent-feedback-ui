import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, IconButton, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { SIGNAL_DEFAULT } from "./types";
import type { SignalIntent, SignalPayload, SignalTimer } from "./types";

export type { SignalIntent, SignalPayload, SignalTimer } from "./types";
export { SIGNAL_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.13 240)";

const TIMERS: Array<{ id: SignalTimer; label: string }> = [
  { id: "off", label: "Off" },
  { id: "30s", label: "30s" },
  { id: "5m",  label: "5min" },
  { id: "1h",  label: "1h" },
  { id: "1d",  label: "1d" },
  { id: "1w",  label: "1w" },
];

export function SignalMessage({
  intent = SIGNAL_DEFAULT,
  onResult,
}: {
  intent?: SignalIntent;
  onResult?: (r: ReviewResult<SignalPayload>) => void;
}) {
  const [message, setMessage] = React.useState(intent.message);
  const [timer, setTimer] = React.useState<SignalTimer>(intent.disappearingTimer ?? "off");

  const edited = message !== intent.message || timer !== (intent.disappearingTimer ?? "off");

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { to: intent.to, message, disappearingTimer: timer },
    summary: `Signal → ${intent.toName || intent.to}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Signal message cancelled" });

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
          <Pill tone="ok" size="sm" icon={<Icon.Lock size={10} />}>
            end-to-end encrypted
          </Pill>
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
            Signal · sealed sender
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Send edited" : "Send"}
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

      {/* Contact card */}
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
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 12, color: "var(--fg-muted)",
            fontFamily: "var(--font-mono)",
          }}>
            {intent.toHandle && <span style={{ color: ACCENT }}>{intent.toHandle}</span>}
            {intent.toHandle && <span style={{ color: "var(--fg-faint)" }}>·</span>}
            <span>{intent.to}</span>
          </div>
        </div>
        <Pill size="xs" tone="default" icon={<Icon.Lock size={9} />}>
          verified
        </Pill>
      </div>

      {/* Bubble preview */}
      <div style={{
        margin: "0 16px 12px",
        padding: "16px 14px",
        background: "var(--bg-inset)",
        border: "1px solid var(--border-faint)",
        borderRadius: 14,
        marginTop: 14,
      }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{
            maxWidth: "84%",
            background: ACCENT,
            color: "oklch(0.96 0.02 240)",
            borderRadius: "16px 16px 4px 16px",
            padding: "10px 14px",
            fontSize: 14, lineHeight: 1.45,
            whiteSpace: "pre-wrap", wordBreak: "break-word",
          }}>
            {message || <span style={{ opacity: 0.5 }}>Type your message…</span>}
          </div>
        </div>
        <div style={{
          marginTop: 6, fontSize: 10.5,
          color: "var(--fg-faint)", textAlign: "right",
          fontFamily: "var(--font-mono)",
          display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4,
        }}>
          {timer !== "off" && <Icon.Calendar size={10} />}
          {timer !== "off" ? `disappears in ${TIMERS.find(t => t.id === timer)?.label}` : "delivered · now"}
        </div>
      </div>

      {/* Editable message */}
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
      </div>

      {/* Attachments + disappearing timer */}
      <div style={{
        padding: "10px 16px 14px",
        borderTop: "1px solid var(--border-faint)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{ display: "flex", gap: 4, color: "var(--fg-dim)" }}>
          <IconButton icon={<Icon.Paperclip size={14} />} label="attach" />
          <IconButton icon={<Icon.Image size={14} />} label="image" />
          <IconButton icon={<Icon.Smile size={14} />} label="sticker" />
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>
          disappear:
        </span>
        <div style={{ display: "flex", gap: 2 }}>
          {TIMERS.map(t => (
            <button
              key={t.id}
              onClick={() => setTimer(t.id)}
              style={{
                height: 22, padding: "0 7px",
                fontSize: 11, fontFamily: "var(--font-mono)",
                color: timer === t.id ? "var(--bg)" : "var(--fg-muted)",
                background: timer === t.id ? ACCENT : "transparent",
                border: `1px solid ${timer === t.id ? ACCENT : "var(--border)"}`,
                borderRadius: 6,
              }}
            >{t.label}</button>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}

import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { INTERCOM_DEFAULT } from "./types";
import type { IntercomIntent, IntercomPayload } from "./types";

export type { IntercomIntent, IntercomPayload, IntercomCustomer } from "./types";
export { INTERCOM_DEFAULT } from "./types";

const ACCENT = "oklch(0.74 0.13 240)";

const SNOOZE_OPTIONS = [
  { id: "",         label: "no snooze" },
  { id: "+1h",      label: "1 hour" },
  { id: "+4h",      label: "4 hours" },
  { id: "tomorrow", label: "tomorrow" },
];

export function IntercomReply({
  intent = INTERCOM_DEFAULT,
  onResult,
}: {
  intent?: IntercomIntent;
  onResult?: (r: ReviewResult<IntercomPayload>) => void;
}) {
  const [reply, setReply] = React.useState(intent.reply);
  const [internalNote, setInternalNote] = React.useState(!!intent.internalNote);
  const [closeAfter, setCloseAfter] = React.useState(false);
  const [snooze, setSnooze] = React.useState("");

  const edited =
    reply !== intent.reply ||
    internalNote !== !!intent.internalNote ||
    closeAfter !== false ||
    snooze !== "";

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      conversationId: intent.conversationId,
      reply,
      internalNote,
      closeAfter,
      snooze: snooze || undefined,
    },
    summary: `${intent.customer.name} · ${internalNote ? "internal note" : closeAfter ? "reply + close" : "reply"}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Intercom reply cancelled" });

  return (
    <ModalShell
      width={620}
      accent={ACCENT}
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)", gap: 12,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--fg-faint)",
          }}>
            #{intent.conversationId}
          </span>
          <div style={{ flex: 1 }} />
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
          <label style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, color: "var(--fg-muted)", cursor: "pointer",
          }}>
            <input
              type="checkbox"
              checked={closeAfter}
              onChange={e => setCloseAfter(e.target.checked)}
              style={{ accentColor: ACCENT }}
            />
            close after sending
          </label>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Icon.Send size={13} />}
            onClick={submit}
          >
            {internalNote ? "Save note" : edited ? "Send edited" : "Send reply"}
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

      {/* Customer card */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 18px",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <Avatar name={intent.customer.name} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{intent.customer.name}</span>
            <Pill size="xs" tone="default">{intent.customer.plan}</Pill>
          </div>
          <div style={{
            fontSize: 11.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-muted)",
          }}>{intent.customer.email}</div>
          <div style={{ fontSize: 11, color: "var(--c-ok)", fontFamily: "var(--font-mono)", marginTop: 2 }}>
            {intent.customer.lastSeen}
          </div>
        </div>
      </div>

      {/* Prior message bubble */}
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-faint)" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <Avatar name={intent.priorMessage.author} size={28} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 13 }}>{intent.priorMessage.author}</span>
              <span style={{ fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>
                {intent.priorMessage.time}
              </span>
            </div>
            <div style={{
              marginTop: 4,
              padding: "10px 12px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border-faint)",
              borderRadius: "10px 10px 10px 2px",
              fontSize: 13, color: "var(--fg)", lineHeight: 1.5,
              whiteSpace: "pre-wrap",
            }}>{intent.priorMessage.text}</div>
          </div>
        </div>
      </div>

      {/* Reply editor */}
      <div style={{ padding: "12px 16px" }}>
        {/* Mode toggle */}
        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
          {[
            { kind: false, label: "Reply" },
            { kind: true,  label: "Internal note" },
          ].map((opt) => {
            const active = internalNote === opt.kind;
            const noteColor = "oklch(0.78 0.16 65)";
            return (
              <button
                key={String(opt.kind)}
                onClick={() => setInternalNote(opt.kind)}
                style={{
                  height: 26, padding: "0 10px",
                  fontSize: 12, fontWeight: 500,
                  border: `1px solid ${active ? (opt.kind ? noteColor : ACCENT) : "var(--border)"}`,
                  background: active
                    ? (opt.kind
                        ? `color-mix(in oklch, ${noteColor} 14%, transparent)`
                        : `color-mix(in oklch, ${ACCENT} 14%, transparent)`)
                    : "transparent",
                  color: active ? (opt.kind ? noteColor : ACCENT) : "var(--fg-muted)",
                  borderRadius: 6,
                }}
              >{opt.label}</button>
            );
          })}
        </div>

        <textarea
          value={reply}
          onChange={e => setReply(e.target.value)}
          rows={5}
          placeholder={internalNote ? "Internal note (only your team sees this)…" : "Reply to customer…"}
          style={{
            width: "100%", padding: "10px 12px",
            background: internalNote ? "color-mix(in oklch, oklch(0.78 0.16 65) 6%, var(--bg-inset))" : "var(--bg-inset)",
            border: `1px solid ${internalNote ? "color-mix(in oklch, oklch(0.78 0.16 65) 30%, var(--border))" : "var(--border)"}`,
            borderRadius: 10, outline: 0,
            fontSize: 13.5, fontFamily: "var(--font-sans)",
            color: "var(--fg)", lineHeight: 1.5,
          }}
        />

        {/* Snooze */}
        <div style={{
          marginTop: 10,
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 12,
        }}>
          <Icon.Calendar size={13} style={{ color: "var(--fg-faint)" }} />
          <span style={{ color: "var(--fg-muted)" }}>Snooze</span>
          <div style={{ display: "flex", gap: 4 }}>
            {SNOOZE_OPTIONS.map(opt => {
              const active = snooze === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSnooze(opt.id)}
                  style={{
                    height: 22, padding: "0 8px",
                    fontSize: 11, fontFamily: "var(--font-mono)",
                    border: `1px solid ${active ? ACCENT : "var(--border)"}`,
                    background: active
                      ? `color-mix(in oklch, ${ACCENT} 14%, transparent)`
                      : "transparent",
                    color: active ? ACCENT : "var(--fg-muted)",
                    borderRadius: 999,
                  }}
                >{opt.label}</button>
              );
            })}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

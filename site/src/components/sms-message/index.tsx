import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { SMS_DEFAULT } from "./types";
import type { SmsIntent, SmsPayload } from "./types";

export type { SmsIntent, SmsPayload } from "./types";
export { SMS_DEFAULT } from "./types";

const SMS_LIMIT = 160;
const ACCENT = "oklch(0.78 0.10 320)";

export function SmsMessage({
  intent = SMS_DEFAULT,
  onResult,
}: {
  intent?: SmsIntent;
  onResult?: (r: ReviewResult<SmsPayload>) => void;
}) {
  const [message, setMessage] = React.useState(intent.message);
  const [scheduleAt, setScheduleAt] = React.useState(intent.scheduleAt ?? "");
  const edited = message !== intent.message || scheduleAt !== (intent.scheduleAt ?? "");

  const segments = Math.ceil(message.length / SMS_LIMIT) || 1;
  const overLimit = message.length > SMS_LIMIT;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { to: intent.to, message, scheduleAt: scheduleAt || undefined },
    summary: `SMS → ${intent.toName || intent.to}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "SMS cancelled" });

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
            {intent.carrier ?? "carrier"} · est. {intent.costEstimate ?? "—"}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {scheduleAt ? "Schedule" : edited ? "Send edited" : "Send SMS"}
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
        <Avatar name={intent.toName || intent.to} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {intent.toName && (
            <div style={{ fontWeight: 600, fontSize: 14 }}>{intent.toName}</div>
          )}
          <div style={{
            fontSize: 12.5, color: "var(--fg-muted)",
            fontFamily: "var(--font-mono)",
          }}>{intent.to}</div>
        </div>
      </div>

      {/* Phone mockup conversation bubble */}
      <div style={{
        margin: "0 16px 14px",
        background: "var(--bg-inset)",
        border: "1px solid var(--border-faint)",
        borderRadius: 14, padding: "16px 14px",
        position: "relative",
      }}>
        <div style={{
          display: "flex", justifyContent: "flex-end",
        }}>
          <div style={{
            maxWidth: "82%",
            background: ACCENT, color: "oklch(0.18 0.02 320)",
            borderRadius: "16px 16px 4px 16px",
            padding: "10px 14px",
            fontSize: 14, lineHeight: 1.45,
            whiteSpace: "pre-wrap", wordBreak: "break-word",
          }}>
            {message || <span style={{ opacity: .5 }}>Type your message…</span>}
          </div>
        </div>
        <div style={{
          marginTop: 6, fontSize: 10.5,
          color: "var(--fg-faint)",
          textAlign: "right",
          fontFamily: "var(--font-mono)",
        }}>
          delivered · {scheduleAt ? "scheduled" : "now"}
        </div>
      </div>

      {/* Editable message */}
      <div style={{ padding: "0 16px 12px" }}>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={3}
          placeholder="Message…"
          style={{
            width: "100%", padding: "10px 12px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)",
            borderRadius: 10,
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
          <span>{message.length} / {SMS_LIMIT * segments}</span>
          <span>·</span>
          <span>{segments} segment{segments === 1 ? "" : "s"}</span>
        </div>
      </div>

      {/* Schedule option */}
      <div style={{
        padding: "12px 16px",
        borderTop: "1px solid var(--border-faint)",
        display: "flex", alignItems: "center", gap: 10,
        fontSize: 12.5,
      }}>
        <Icon.Calendar size={13} style={{ color: "var(--fg-faint)" }} />
        <span style={{ color: "var(--fg-muted)" }}>Send</span>
        <select
          value={scheduleAt}
          onChange={e => setScheduleAt(e.target.value)}
          style={{
            height: 28, padding: "0 8px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 6,
            fontSize: 12.5, color: "var(--fg)",
          }}
        >
          <option value="">now</option>
          <option value="+1h">in 1 hour</option>
          <option value="tomorrow-9">tomorrow at 9am</option>
          <option value="monday-9">Monday at 9am</option>
        </select>
      </div>
    </ModalShell>
  );
}

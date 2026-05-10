import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { ZENDESK_DEFAULT, STATUS_COLOR } from "./types";
import type { ZendeskIntent, ZendeskPayload, ZendeskStatus } from "./types";

export type { ZendeskIntent, ZendeskPayload, ZendeskStatus } from "./types";
export { ZENDESK_DEFAULT } from "./types";

const ACCENT = "oklch(0.74 0.10 145)";

export function ZendeskReply({
  intent = ZENDESK_DEFAULT,
  onResult,
}: {
  intent?: ZendeskIntent;
  onResult?: (r: ReviewResult<ZendeskPayload>) => void;
}) {
  const [reply, setReply] = React.useState(intent.reply);
  const [isInternal, setIsInternal] = React.useState(!!intent.isInternal);
  const [newStatus, setNewStatus] = React.useState<ZendeskStatus>(intent.newStatus ?? "pending");

  const edited =
    reply !== intent.reply ||
    isInternal !== !!intent.isInternal ||
    newStatus !== (intent.newStatus ?? "pending");

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { ticketNumber: intent.ticketNumber, reply, isInternal, newStatus },
    summary: `#${intent.ticketNumber} → ${newStatus}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: `Ticket #${intent.ticketNumber} reply cancelled` });

  return (
    <ModalShell
      width={640}
      accent={ACCENT}
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)", gap: 12,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontFamily: "var(--font-mono)", fontSize: 11.5,
            color: ACCENT,
            padding: "2px 8px",
            background: `color-mix(in oklch, ${ACCENT} 10%, transparent)`,
            border: `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)`,
            borderRadius: 6,
          }}>
            #{intent.ticketNumber}
          </span>
          <div style={{ flex: 1 }} />
          <Pill size="sm" tone={intent.priority === "Urgent" ? "err" : intent.priority === "High" ? "warn" : "default"}>
            {intent.priority}
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
            status →
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 11.5, fontFamily: "var(--font-mono)",
            color: STATUS_COLOR[newStatus],
          }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: STATUS_COLOR[newStatus] }} />
            {newStatus}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {isInternal ? "Save note" : edited ? "Send edited" : "Send reply"}
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

      {/* Subject */}
      <div style={{
        padding: "14px 18px",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 6,
        }}>Subject</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--fg)", lineHeight: 1.3 }}>
          {intent.subject}
        </div>
      </div>

      {/* Requester */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 18px",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <Avatar name={intent.requester.name} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{intent.requester.name}</div>
          <div style={{ fontSize: 11.5, fontFamily: "var(--font-mono)", color: "var(--fg-muted)" }}>
            {intent.requester.email}
          </div>
        </div>
        {intent.organization && (
          <Pill size="xs" tone="default">
            <Icon.Users size={10} />
            <span style={{ marginLeft: 4 }}>{intent.organization}</span>
          </Pill>
        )}
      </div>

      {/* Public/internal toggle */}
      <div style={{ padding: "12px 18px 0", display: "flex", gap: 4 }}>
        {[
          { kind: false, label: "Public reply" },
          { kind: true,  label: "Internal note" },
        ].map(opt => {
          const active = isInternal === opt.kind;
          const noteColor = "oklch(0.78 0.16 65)";
          return (
            <button
              key={String(opt.kind)}
              onClick={() => setIsInternal(opt.kind)}
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

      <div style={{ padding: "10px 16px 14px" }}>
        <textarea
          value={reply}
          onChange={e => setReply(e.target.value)}
          rows={6}
          placeholder={isInternal ? "Internal note (only agents see this)…" : "Reply to requester…"}
          style={{
            width: "100%", padding: "10px 12px",
            background: isInternal ? "color-mix(in oklch, oklch(0.78 0.16 65) 6%, var(--bg-inset))" : "var(--bg-inset)",
            border: `1px solid ${isInternal ? "color-mix(in oklch, oklch(0.78 0.16 65) 30%, var(--border))" : "var(--border)"}`,
            borderRadius: 10, outline: 0,
            fontSize: 13.5, fontFamily: "var(--font-sans)",
            color: "var(--fg)", lineHeight: 1.5,
          }}
        />
      </div>

      {/* Status picker */}
      <div style={{
        padding: "10px 16px 14px",
        borderTop: "1px solid var(--border-faint)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)", textTransform: "uppercase", letterSpacing: 0.6 }}>
          Set status
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {(["open", "pending", "solved", "closed"] as ZendeskStatus[]).map(s => {
            const active = newStatus === s;
            const color = STATUS_COLOR[s];
            return (
              <button
                key={s}
                onClick={() => setNewStatus(s)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  height: 24, padding: "0 10px",
                  fontSize: 11.5, fontFamily: "var(--font-mono)",
                  border: `1px solid ${active ? color : "var(--border)"}`,
                  background: active
                    ? `color-mix(in oklch, ${color} 14%, transparent)`
                    : "transparent",
                  color: active ? color : "var(--fg-muted)",
                  borderRadius: 6,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: 999, background: color }} />
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </ModalShell>
  );
}

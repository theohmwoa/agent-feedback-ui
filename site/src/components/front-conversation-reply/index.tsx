import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { FRONT_DEFAULT, ASSIGNEES } from "./types";
import type { FrontChannel, FrontIntent, FrontPayload } from "./types";

export type { FrontIntent, FrontPayload, FrontChannel } from "./types";
export { FRONT_DEFAULT } from "./types";

const ACCENT = "oklch(0.74 0.10 30)";

const CHANNEL_META: Record<FrontChannel, { label: string; bg: string; fg: string }> = {
  email:   { label: "Email",   bg: "var(--c-mail)",   fg: "var(--bg)" },
  sms:     { label: "SMS",     bg: "oklch(0.78 0.10 320)", fg: "var(--bg)" },
  chat:    { label: "Chat",    bg: "var(--c-slack)",  fg: "var(--bg)" },
  twitter: { label: "Twitter", bg: "var(--c-linear)", fg: "var(--bg)" },
};

export function FrontConversationReply({
  intent = FRONT_DEFAULT,
  onResult,
}: {
  intent?: FrontIntent;
  onResult?: (r: ReviewResult<FrontPayload>) => void;
}) {
  const [reply, setReply] = React.useState(intent.reply);
  const [assignee, setAssignee] = React.useState(intent.assignee ?? "unassigned");
  const [tags, setTags] = React.useState<string[]>(intent.tags);
  const [snooze, setSnooze] = React.useState(intent.snooze ?? "");

  const edited =
    reply !== intent.reply ||
    assignee !== (intent.assignee ?? "unassigned") ||
    JSON.stringify(tags) !== JSON.stringify(intent.tags) ||
    snooze !== (intent.snooze ?? "");

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      conversationId: intent.conversationId,
      reply,
      assignee: assignee === "unassigned" ? undefined : assignee,
      tags,
      snooze: snooze || undefined,
    },
    summary: `${intent.channel} · ${intent.recipients[0]}${intent.recipients.length > 1 ? ` +${intent.recipients.length - 1}` : ""}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Front reply cancelled" });

  const ch = CHANNEL_META[intent.channel];

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
            display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: "var(--font-mono)", fontSize: 11.5,
            color: ch.fg,
            padding: "2px 8px",
            background: ch.bg,
            borderRadius: 6,
          }}>
            {intent.channel === "email"  && <Icon.Send size={11} />}
            {intent.channel === "sms"    && <Icon.AtSign size={11} />}
            {intent.channel === "chat"   && <Icon.Hash size={11} />}
            {intent.channel === "twitter"&& <Icon.AtSign size={11} />}
            {ch.label}
          </span>
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
            {intent.conversationId}
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
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
            {snooze ? `snooze: ${snooze}` : "no snooze"}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Send edited" : "Send reply"}
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

      {/* Conversation card */}
      <div style={{
        padding: "12px 18px",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        {intent.subject && (
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{intent.subject}</div>
        )}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 4,
          fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--fg-muted)",
        }}>
          <span style={{ color: "var(--fg-faint)" }}>to:</span>
          {intent.recipients.map((r, i) => (
            <span key={i}>{r}{i < intent.recipients.length - 1 ? "," : ""}</span>
          ))}
        </div>
      </div>

      {/* Reply */}
      <div style={{ padding: "12px 16px" }}>
        <textarea
          value={reply}
          onChange={e => setReply(e.target.value)}
          rows={6}
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

      {/* Assignee + tags + snooze */}
      <div style={{
        padding: "10px 16px 14px",
        borderTop: "1px solid var(--border-faint)",
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        <Row label="Assignee" icon={<Icon.User size={12} />}>
          <select
            value={assignee}
            onChange={e => setAssignee(e.target.value)}
            style={{
              height: 26, padding: "0 8px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)", borderRadius: 6,
              fontSize: 12, color: "var(--fg)",
            }}
          >
            {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </Row>
        <Row label="Tags" icon={<Icon.Tag size={12} />}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {tags.map(t => (
              <span
                key={t}
                onClick={() => setTags(tags.filter(x => x !== t))}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: 11, padding: "2px 8px",
                  background: `color-mix(in oklch, ${ACCENT} 14%, var(--bg-inset))`,
                  border: `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)`,
                  borderRadius: 999,
                  color: ACCENT, cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {t}
                <Icon.X size={9} />
              </span>
            ))}
            <button
              style={{
                fontSize: 11, padding: "2px 8px",
                background: "transparent",
                border: "1px dashed var(--border-strong)",
                borderRadius: 999, color: "var(--fg-faint)",
                fontFamily: "var(--font-mono)",
              }}
            >+ tag</button>
          </div>
        </Row>
        <Row label="Snooze" icon={<Icon.Calendar size={12} />}>
          <select
            value={snooze}
            onChange={e => setSnooze(e.target.value)}
            style={{
              height: 26, padding: "0 8px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)", borderRadius: 6,
              fontSize: 12, color: "var(--fg)",
            }}
          >
            <option value="">no snooze</option>
            <option value="+1h">1 hour</option>
            <option value="+4h">4 hours</option>
            <option value="tomorrow-9">tomorrow at 9am</option>
            <option value="monday-9">Monday at 9am</option>
          </select>
        </Row>
      </div>
    </ModalShell>
  );
}

function Row({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{
        width: 80, display: "inline-flex", alignItems: "center", gap: 6,
        fontSize: 11, fontFamily: "var(--font-mono)",
        color: "var(--fg-faint)", letterSpacing: 0.6,
        textTransform: "uppercase",
      }}>
        {icon}
        {label}
      </span>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, IconButton, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { TELEGRAM_DEFAULT } from "./types";
import type { TelegramIntent, TelegramPayload } from "./types";

export type { TelegramIntent, TelegramPayload, TelegramTarget } from "./types";
export { TELEGRAM_DEFAULT } from "./types";

const ACCENT = "oklch(0.74 0.13 220)";

export function TelegramMessage({
  intent = TELEGRAM_DEFAULT,
  onResult,
}: {
  intent?: TelegramIntent;
  onResult?: (r: ReviewResult<TelegramPayload>) => void;
}) {
  const [message, setMessage] = React.useState(intent.message);
  const [scheduleAt, setScheduleAt] = React.useState(intent.scheduleAt ?? "");
  const [silent, setSilent] = React.useState(!!intent.silent);

  const edited =
    message !== intent.message ||
    scheduleAt !== (intent.scheduleAt ?? "") ||
    silent !== !!intent.silent;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { target: intent.target, message, scheduleAt: scheduleAt || undefined, silent },
    summary: `Telegram → ${intent.target.kind === "channel" ? intent.target.name : `@${intent.target.handle}`}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Telegram cancelled" });

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
              checked={silent}
              onChange={e => setSilent(e.target.checked)}
              style={{ accentColor: ACCENT }}
            />
            silent send (no notification)
          </label>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {scheduleAt ? "Schedule" : edited ? "Send edited" : "Send"}
          </Button>
        </div>
      }
    >
      {/* Target strip */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 16px",
        background: `color-mix(in oklch, ${ACCENT} 6%, transparent)`,
        borderBottom: "1px solid var(--border-faint)",
        fontSize: 12.5,
      }}>
        <Avatar
          name={intent.target.kind === "channel" ? intent.target.name : intent.target.name}
          size={28}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: "var(--fg)" }}>
            {intent.target.name}
          </div>
          <div style={{ fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>
            {intent.target.kind === "channel"
              ? `${intent.target.subscribers.toLocaleString()} subscribers · channel`
              : `@${intent.target.handle} · direct message`}
          </div>
        </div>
        <Pill tone="default" size="xs">
          {intent.target.kind === "channel" ? "channel" : "DM"}
        </Pill>
      </div>

      {intent.rationale && (
        <div style={{
          display: "flex", gap: 10,
          padding: "10px 16px",
          fontSize: 12, color: "var(--fg-muted)",
          background: `color-mix(in oklch, ${ACCENT} 4%, transparent)`,
          borderBottom: "1px solid var(--border-faint)",
        }}>
          <Icon.Sparkles size={13} style={{ color: ACCENT, marginTop: 2, flexShrink: 0 }} />
          <span>{intent.rationale}</span>
        </div>
      )}

      <div style={{ padding: "14px 16px" }}>
        {/* Formatting toolbar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 2,
          padding: "4px 0 8px",
          color: "var(--fg-dim)",
        }}>
          <IconButton icon={<Icon.Bold size={13} />} label="bold" />
          <IconButton icon={<Icon.Italic size={13} />} label="italic" />
          <IconButton icon={<Icon.Code size={13} />} label="code" />
          <IconButton icon={<Icon.Link size={13} />} label="link" />
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
            markdown
          </span>
        </div>

        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={7}
          placeholder="Message…"
          style={{
            width: "100%", padding: "12px 14px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 10,
            outline: 0,
            fontSize: 13.5, fontFamily: "var(--font-sans)",
            color: "var(--fg)", lineHeight: 1.5,
            minHeight: 140, display: "block",
          }}
        />

        {/* Schedule picker */}
        <div style={{
          marginTop: 12,
          display: "flex", alignItems: "center", gap: 10,
          padding: "8px 10px",
          background: "var(--bg-inset)",
          border: "1px solid var(--border)", borderRadius: 8,
          fontSize: 12.5,
        }}>
          <Icon.Calendar size={13} style={{ color: "var(--fg-faint)" }} />
          <span style={{ color: "var(--fg-muted)" }}>Send</span>
          <select
            value={scheduleAt}
            onChange={e => setScheduleAt(e.target.value)}
            style={{
              flex: 1, height: 24, padding: "0 6px",
              background: "transparent",
              border: 0, outline: 0,
              fontSize: 12.5, color: "var(--fg)",
            }}
          >
            <option value="">now</option>
            <option value="+10m">in 10 minutes</option>
            <option value="+1h">in 1 hour</option>
            <option value="tomorrow-9">tomorrow at 9am</option>
            <option value="monday-9">Monday at 9am</option>
          </select>
        </div>
      </div>
    </ModalShell>
  );
}

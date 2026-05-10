import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, IconButton, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { DISCORD_DEFAULT } from "./types";
import type { DiscordIntent, DiscordPayload } from "./types";

export type { DiscordIntent, DiscordPayload, DiscordTarget } from "./types";
export { DISCORD_DEFAULT } from "./types";

const ACCENT = "oklch(0.74 0.13 280)";

export function DiscordMessage({
  intent = DISCORD_DEFAULT,
  onResult,
}: {
  intent?: DiscordIntent;
  onResult?: (r: ReviewResult<DiscordPayload>) => void;
}) {
  const [message, setMessage] = React.useState(intent.message);
  const [mentions, setMentions] = React.useState<string[]>(intent.mentions ?? []);
  const [attachAttachment, setAttachAttachment] = React.useState<boolean>(!!intent.attachment);
  const edited =
    message !== intent.message ||
    JSON.stringify(mentions) !== JSON.stringify(intent.mentions ?? []) ||
    attachAttachment !== !!intent.attachment;

  const targetLabel =
    intent.target.kind === "channel"
      ? `#${intent.target.channel}`
      : `@${intent.target.userHandle}`;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { target: intent.target, message, mentions, attachAttachment },
    summary: `${targetLabel} · ${message.slice(0, 48)}${message.length > 48 ? "…" : ""}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: `Discord post to ${targetLabel} cancelled` });

  return (
    <ModalShell
      width={600}
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
          <Pill tone="default" size="sm">
            send to {targetLabel}
          </Pill>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Send edited" : "Send"}
          </Button>
        </div>
      }
    >
      {/* Server / DM selector strip */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 16px",
        background: `color-mix(in oklch, ${ACCENT} 6%, transparent)`,
        borderBottom: "1px solid var(--border-faint)",
        fontSize: 12.5,
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          background: ACCENT, color: "var(--bg)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 12, fontFamily: "var(--font-mono)",
        }}>
          {intent.target.kind === "channel"
            ? intent.target.server[0]?.toUpperCase()
            : intent.target.user[0]?.toUpperCase()}
        </div>
        <span style={{ color: "var(--fg-muted)" }}>
          {intent.target.kind === "channel" ? intent.target.server : intent.target.user}
        </span>
        <span style={{ color: "var(--fg-faint)" }}>/</span>
        {intent.target.kind === "channel" ? (
          <Icon.Hash size={13} style={{ color: "var(--fg-faint)" }} />
        ) : (
          <Icon.AtSign size={13} style={{ color: "var(--fg-faint)" }} />
        )}
        <span style={{ color: "var(--fg)", fontWeight: 500 }}>
          {intent.target.kind === "channel" ? intent.target.channel : intent.target.userHandle}
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
          {intent.target.kind === "channel" ? "channel" : "direct message"}
        </span>
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
        <div style={{
          border: "1px solid var(--border)",
          borderRadius: 10,
          background: "var(--bg-inset)",
          overflow: "hidden",
        }}>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={6}
            style={{
              width: "100%", padding: "12px 14px",
              background: "transparent", border: 0, outline: 0,
              fontSize: 13.5, fontFamily: "var(--font-sans)",
              color: "var(--fg)", lineHeight: 1.55,
              display: "block", minHeight: 130,
            }}
          />
          <div style={{
            display: "flex", alignItems: "center", gap: 2,
            padding: "6px 8px",
            borderTop: "1px solid var(--border-faint)",
            color: "var(--fg-dim)",
          }}>
            <IconButton icon={<Icon.Bold size={13} />} label="bold" />
            <IconButton icon={<Icon.Italic size={13} />} label="italic" />
            <IconButton icon={<Icon.Code size={13} />} label="code" />
            <IconButton icon={<Icon.AtSign size={13} />} label="mention" />
            <IconButton icon={<Icon.Smile size={13} />} label="emoji" />
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)", marginRight: 6 }}>
              {message.length} chars
            </span>
          </div>
        </div>

        {mentions.length > 0 && (
          <div style={{ marginTop: 10, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>mentions →</span>
            {mentions.map(m => (
              <span
                key={m}
                onClick={() => setMentions(mentions.filter(x => x !== m))}
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
                {m}
                <Icon.X size={9} />
              </span>
            ))}
          </div>
        )}

        {/* Attachment toggle */}
        {intent.attachment && (
          <label style={{
            marginTop: 12,
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 10px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 12.5,
          }}>
            <input
              type="checkbox"
              checked={attachAttachment}
              onChange={e => setAttachAttachment(e.target.checked)}
              style={{ accentColor: ACCENT }}
            />
            <Icon.Paperclip size={13} style={{ color: "var(--fg-muted)" }} />
            <span style={{ color: "var(--fg)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
              {intent.attachment.name}
            </span>
            <span style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
              · {intent.attachment.size}
            </span>
            <div style={{ flex: 1 }} />
            <Avatar name="agent" size={20} />
          </label>
        )}
      </div>
    </ModalShell>
  );
}

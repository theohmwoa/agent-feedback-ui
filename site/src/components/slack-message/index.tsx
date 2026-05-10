import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, IconButton, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { SLACK_DEFAULT } from "./types";
import type { SlackIntent, SlackPayload } from "./types";

export type { SlackIntent, SlackPayload } from "./types";
export { SLACK_DEFAULT } from "./types";

export function SlackMessage({
  intent = SLACK_DEFAULT,
  onResult,
}: {
  intent?: SlackIntent;
  onResult?: (r: ReviewResult<SlackPayload>) => void;
}) {
  const [message, setMessage] = React.useState(intent.message);
  const [edited, setEdited] = React.useState(false);
  const [broadcast, setBroadcast] = React.useState(false);

  React.useEffect(() => setEdited(message !== intent.message), [message, intent.message]);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { channel: intent.channel, message, broadcast },
    summary: `#${intent.channel} · ${message.slice(0, 48)}${message.length > 48 ? "…" : ""}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: `Slack post to #${intent.channel} cancelled` });

  return (
    <ModalShell
      width={580}
      accent="var(--c-slack)"
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
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 12, color: "var(--fg-muted)", cursor: "pointer",
          }}>
            <input
              type="checkbox"
              checked={broadcast}
              onChange={e => setBroadcast(e.target.checked)}
              style={{ accentColor: "var(--c-slack)" }}
            />
            <span>Also send to #{intent.channel}</span>
          </label>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Send edit" : "Send reply"}
          </Button>
        </div>
      }
    >
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 16px",
        background: "color-mix(in oklch, var(--c-slack) 6%, transparent)",
        borderBottom: "1px solid var(--border-faint)",
        fontSize: 12.5,
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          background: "var(--c-slack)", color: "var(--bg)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 12, fontFamily: "var(--font-mono)",
        }}>{intent.workspace[0]?.toUpperCase()}</div>
        <span style={{ color: "var(--fg-muted)" }}>{intent.workspace}</span>
        <span style={{ color: "var(--fg-faint)" }}>/</span>
        <Icon.Hash size={13} style={{ color: "var(--fg-faint)" }} />
        <span style={{ color: "var(--fg)", fontWeight: 500 }}>{intent.channel}</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
          replying in thread
        </span>
      </div>

      {intent.thread && (
        <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid var(--border-faint)" }}>
          <div style={{ display: "flex", gap: 10 }}>
            <Avatar name={intent.thread.parent.author} size={32} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 13.5 }}>{intent.thread.parent.author}</span>
                <span style={{ fontSize: 11, color: "var(--fg-faint)" }}>{intent.thread.parent.time}</span>
              </div>
              <div style={{
                fontSize: 13.5, color: "var(--fg-muted)", lineHeight: 1.5, marginTop: 2,
              }}>
                {intent.thread.parent.text}
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                <Pill size="xs" tone="default">💬 {intent.thread.replies} replies</Pill>
              </div>
            </div>
          </div>
        </div>
      )}

      {intent.rationale && (
        <div style={{
          display: "flex", gap: 10,
          padding: "10px 16px",
          fontSize: 12, color: "var(--fg-muted)",
          background: "color-mix(in oklch, var(--c-slack) 4%, transparent)",
          borderBottom: "1px solid var(--border-faint)",
        }}>
          <Icon.Sparkles size={13} style={{ color: "var(--c-slack)", marginTop: 2, flexShrink: 0 }} />
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
            rows={5}
            style={{
              width: "100%",
              padding: "12px 14px",
              background: "transparent",
              border: 0, outline: 0,
              fontSize: 13.5, fontFamily: "var(--font-sans)",
              color: "var(--fg)", lineHeight: 1.55,
              display: "block", minHeight: 110,
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
            <IconButton icon={<Icon.Link size={13} />} label="link" />
            <IconButton icon={<Icon.AtSign size={13} />} label="mention" />
            <IconButton icon={<Icon.Smile size={13} />} label="emoji" />
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)", marginRight: 6 }}>
              {message.length} chars
            </span>
          </div>
        </div>

        {(intent.mentions?.length ?? 0) > 0 && (
          <div style={{ marginTop: 10, display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>mentions →</span>
            {intent.mentions!.map(m => (
              <Pill key={m} size="xs" tone="default">
                <span style={{ color: "var(--c-slack)" }}>{m}</span>
              </Pill>
            ))}
          </div>
        )}
      </div>
    </ModalShell>
  );
}

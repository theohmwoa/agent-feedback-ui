import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { JIRA_COMMENT_DEFAULT } from "./types";
import type { JiraCommentIntent, JiraCommentPayload } from "./types";

export type { JiraCommentIntent, JiraCommentPayload } from "./types";
export { JIRA_COMMENT_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.10 240)";

export function JiraComment({
  intent = JIRA_COMMENT_DEFAULT,
  onResult,
}: {
  intent?: JiraCommentIntent;
  onResult?: (r: ReviewResult<JiraCommentPayload>) => void;
}) {
  const [body, setBody] = React.useState(intent.body);
  const [internal, setInternal] = React.useState(!!intent.internal);
  const [mentions] = React.useState<string[]>(intent.mentions ?? []);
  const edited = body !== intent.body || internal !== !!intent.internal;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      issueKey: intent.issue.key,
      body, mentions, internal,
    },
    summary: `${intent.issue.key} · ${body.slice(0, 60)}${body.length > 60 ? "…" : ""}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: `Comment on ${intent.issue.key} cancelled` });

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
            color: ACCENT,
            padding: "3px 8px",
            border: `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)`,
            background: `color-mix(in oklch, ${ACCENT} 10%, transparent)`,
            borderRadius: 6,
          }}>
            <Icon.Layers size={11} />
            {intent.issue.key}
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
            comment
          </span>
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
              checked={internal}
              onChange={e => setInternal(e.target.checked)}
              style={{ accentColor: ACCENT }}
            />
            <Icon.Lock size={11} style={{ color: internal ? ACCENT : "var(--fg-faint)" }} />
            <span>Internal only</span>
          </label>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Post edited" : "Post comment"}
            <span style={{ marginLeft: 6, opacity: .55 }}>
              <Kbd>⌘</Kbd>
              <span style={{ marginLeft: 2 }}><Kbd>↵</Kbd></span>
            </span>
          </Button>
        </div>
      }
    >
      {/* Issue context card */}
      <div style={{
        padding: "12px 16px",
        background: `color-mix(in oklch, ${ACCENT} 5%, transparent)`,
        borderBottom: "1px solid var(--border-faint)",
        display: "flex", alignItems: "flex-start", gap: 12,
      }}>
        <span style={{
          width: 22, height: 22, borderRadius: 4,
          background: `color-mix(in oklch, ${ACCENT} 25%, transparent)`,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          color: ACCENT, fontWeight: 700, fontSize: 12,
          flexShrink: 0,
        }}>●</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13.5, color: "var(--fg)",
            fontWeight: 500, marginBottom: 4,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{intent.issue.summary}</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{
              fontSize: 11, fontFamily: "var(--font-mono)",
              padding: "2px 6px",
              background: "var(--bg-inset)", border: "1px solid var(--border)",
              borderRadius: 4, color: "var(--fg)",
            }}>{intent.issue.status}</span>
            {intent.issue.type && (
              <span style={{ fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>
                {intent.issue.type}
              </span>
            )}
            {intent.issue.priority && (
              <span style={{ fontSize: 11, color: "var(--c-err)", fontFamily: "var(--font-mono)" }}>
                {intent.issue.priority}
              </span>
            )}
          </div>
        </div>
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

      {/* Prior comments thread */}
      {intent.priorComments.length > 0 && (
        <div style={{
          padding: "10px 16px 4px",
          borderBottom: "1px solid var(--border-faint)",
          maxHeight: 200, overflowY: "auto",
        }}>
          <div style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 8,
          }}>
            Activity · last {intent.priorComments.length}
          </div>
          {intent.priorComments.map((c, i) => (
            <div key={i} style={{
              display: "flex", gap: 10,
              padding: "8px 0",
              borderBottom: i < intent.priorComments.length - 1 ? "1px solid var(--border-faint)" : "none",
            }}>
              <Avatar name={c.author} size={24} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600 }}>{c.author}</span>
                  <span style={{ fontSize: 10.5, color: "var(--fg-faint)" }}>{c.time}</span>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--fg-muted)", lineHeight: 1.55 }}>
                  {c.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Compose */}
      <div style={{ padding: "14px 16px" }}>
        <div style={{
          border: "1px solid var(--border)",
          borderRadius: 10,
          background: "var(--bg-inset)",
          overflow: "hidden",
        }}>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={5}
            placeholder="Add a comment…"
            style={{
              width: "100%",
              padding: "12px 14px",
              background: "transparent",
              border: 0, outline: 0,
              fontSize: 13.5, fontFamily: "var(--font-sans)",
              color: "var(--fg)", lineHeight: 1.55,
              display: "block", minHeight: 100,
            }}
          />
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "6px 8px",
            borderTop: "1px solid var(--border-faint)",
            color: "var(--fg-dim)",
          }}>
            <ToolBtn icon={<Icon.Bold size={12} />} />
            <ToolBtn icon={<Icon.Italic size={12} />} />
            <ToolBtn icon={<Icon.Code size={12} />} />
            <ToolBtn icon={<Icon.Link size={12} />} />
            <ToolBtn icon={<Icon.AtSign size={12} />} />
            <ToolBtn icon={<Icon.Paperclip size={12} />} />
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)", marginRight: 6 }}>
              {body.length} chars
            </span>
          </div>
        </div>

        {mentions.length > 0 && (
          <div style={{ marginTop: 10, display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>
              mentions →
            </span>
            {mentions.map(m => (
              <span key={m} style={{
                fontSize: 11, padding: "2px 8px",
                background: "var(--bg-inset)",
                border: `1px solid color-mix(in oklch, ${ACCENT} 28%, transparent)`,
                borderRadius: 999,
                color: ACCENT, fontFamily: "var(--font-mono)",
              }}>{m}</span>
            ))}
          </div>
        )}
      </div>
    </ModalShell>
  );
}

function ToolBtn({ icon }: { icon: React.ReactNode }) {
  return (
    <button style={{
      width: 22, height: 22,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      borderRadius: 4, color: "var(--fg-dim)",
      cursor: "pointer", background: "transparent",
    }}>
      {icon}
    </button>
  );
}

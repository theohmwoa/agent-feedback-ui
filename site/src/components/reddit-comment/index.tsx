import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { REDDIT_COMMENT_DEFAULT } from "./types";
import type { RedditCommentIntent, RedditCommentPayload } from "./types";

export type { RedditCommentIntent, RedditCommentPayload } from "./types";
export { REDDIT_COMMENT_DEFAULT } from "./types";

const ACCENT = "oklch(0.68 0.16 30)";

export function RedditComment({
  intent = REDDIT_COMMENT_DEFAULT,
  onResult,
}: {
  intent?: RedditCommentIntent;
  onResult?: (r: ReviewResult<RedditCommentPayload>) => void;
}) {
  const [reply, setReply] = React.useState(intent.reply);
  const edited = reply !== intent.reply;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      subreddit: intent.subreddit,
      parentAuthor: intent.parent.author,
      reply,
    },
    summary: `${intent.subreddit} · reply to ${intent.parent.author}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Reddit reply cancelled" });

  const distinguishedColor: Record<NonNullable<RedditCommentIntent["parent"]["distinguished"]>, string> = {
    op: ACCENT,
    mod: "var(--c-ok)",
    admin: "var(--c-err)",
  };

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
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "2px 8px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 6,
            fontSize: 12, fontFamily: "var(--font-mono)",
            color: "var(--fg)",
          }}>
            <span style={{
              width: 16, height: 16, borderRadius: 999,
              background: ACCENT, color: "oklch(0.18 0.04 30)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 10,
            }}>r</span>
            {intent.subreddit}
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
            comment reply
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
          <button style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 11.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-muted)",
            padding: "4px 8px",
            border: "1px solid var(--border)", borderRadius: 6,
          }}>
            <Icon.Copy size={11} />
            save draft
          </button>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            disabled={reply.trim().length === 0}
            icon={<Icon.Send size={13} />}
            onClick={submit}
          >
            {edited ? "Reply edited" : "Reply"}
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

      {/* Parent comment */}
      <div style={{
        padding: "14px 16px",
        borderLeft: `3px solid ${ACCENT}`,
        margin: "12px 14px 0",
        background: "var(--bg-inset)",
        borderRadius: "0 8px 8px 0",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          marginBottom: 8,
          fontSize: 12, fontFamily: "var(--font-mono)",
        }}>
          <Avatar name={intent.parent.author} size={20} />
          <span style={{ fontWeight: 600, color: "var(--fg)" }}>
            {intent.parent.author}
          </span>
          {intent.parent.distinguished && (
            <span style={{
              fontSize: 10, fontWeight: 700, padding: "1px 5px",
              border: `1px solid ${distinguishedColor[intent.parent.distinguished]}`,
              color: distinguishedColor[intent.parent.distinguished],
              borderRadius: 4,
              textTransform: "uppercase",
            }}>
              {intent.parent.distinguished}
            </span>
          )}
          <span style={{ color: "var(--fg-faint)" }}>·</span>
          <span style={{ color: "var(--fg-faint)" }}>{intent.parent.score} pts</span>
          <span style={{ color: "var(--fg-faint)" }}>·</span>
          <span style={{ color: "var(--fg-faint)" }}>{intent.parent.age}</span>
        </div>
        <div style={{
          fontSize: 13.5, color: "var(--fg-muted)",
          lineHeight: 1.55, whiteSpace: "pre-wrap",
        }}>
          {intent.parent.body}
        </div>
      </div>

      {/* Reply composer */}
      <div style={{ padding: "14px 16px" }}>
        <textarea
          value={reply}
          onChange={e => setReply(e.target.value)}
          rows={10}
          placeholder="What are your thoughts?"
          style={{
            width: "100%", padding: "12px 14px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)",
            borderRadius: 10, outline: 0,
            fontSize: 13.5, fontFamily: "var(--font-sans)",
            color: "var(--fg)", lineHeight: 1.55,
            minHeight: 200, display: "block",
            resize: "vertical",
          }}
        />
        <div style={{
          marginTop: 8, display: "flex", alignItems: "center", gap: 12,
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
        }}>
          <Icon.Code size={12} />
          <span>markdown supported</span>
          <div style={{ flex: 1 }} />
          <span>{reply.length} chars</span>
        </div>
      </div>
    </ModalShell>
  );
}

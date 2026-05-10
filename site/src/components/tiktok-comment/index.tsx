import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { TIKTOK_COMMENT_DEFAULT, formatViews } from "./types";
import type { TiktokIntent, TiktokPayload } from "./types";

export type { TiktokIntent, TiktokPayload } from "./types";
export { TIKTOK_COMMENT_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.06 350)";
const LIMIT = 150;

export function TiktokComment({
  intent = TIKTOK_COMMENT_DEFAULT,
  onResult,
}: {
  intent?: TiktokIntent;
  onResult?: (r: ReviewResult<TiktokPayload>) => void;
}) {
  const [comment, setComment] = React.useState(intent.comment);
  const [pin, setPin] = React.useState(!!intent.pin);
  const edited = comment !== intent.comment || pin !== !!intent.pin;

  const remaining = LIMIT - comment.length;
  const overLimit = remaining < 0;
  const counterColor = overLimit ? "var(--c-err)" : remaining <= 20 ? "var(--c-warn)" : "var(--fg-faint)";

  const submit = () => {
    if (overLimit) return;
    onResult?.({
      kind: edited ? "edit" : "submit",
      payload: { videoCreator: intent.video.creator, comment, pin },
      summary: `TikTok · "${comment.slice(0, 48)}${comment.length > 48 ? "…" : ""}"`,
    });
  };
  const cancel = () => onResult?.({ kind: "cancel", summary: "TikTok comment cancelled" });

  const hue = intent.video.thumbHue ?? 350;

  return (
    <ModalShell
      width={560}
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
          {intent.isCreator && (
            <button
              onClick={() => setPin(!pin)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 11.5, fontFamily: "var(--font-mono)",
                color: pin ? ACCENT : "var(--fg-muted)",
                padding: "4px 8px",
                border: pin ? `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)` : "1px solid var(--border)",
                background: pin ? `color-mix(in oklch, ${ACCENT} 10%, transparent)` : "var(--bg-inset)",
                borderRadius: 999, fontWeight: 500,
              }}
            >
              <Icon.Flag size={11} />
              {pin ? "pinned" : "pin to top"}
            </button>
          )}
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: counterColor }}>
            {comment.length} / {LIMIT}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            disabled={overLimit || comment.trim().length === 0}
            icon={<Icon.Send size={13} />}
            onClick={submit}
          >
            {edited ? "Comment edited" : "Comment"}
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

      {/* Video card preview */}
      <div style={{
        margin: "12px 14px",
        padding: 10,
        background: "var(--bg-inset)",
        border: "1px solid var(--border-faint)",
        borderRadius: 12,
        display: "flex", gap: 12,
      }}>
        <div style={{
          width: 64, height: 96,
          borderRadius: 8,
          background: `linear-gradient(180deg, oklch(0.4 0.18 ${hue}) 0%, oklch(0.18 0.04 ${hue + 30}) 100%)`,
          flexShrink: 0,
          position: "relative",
          display: "flex", alignItems: "flex-end", padding: 6,
        }}>
          <Icon.Send size={11} style={{ color: "rgba(255,255,255,0.85)" }} />
          <span style={{
            position: "absolute", top: 6, left: 6,
            fontSize: 9, fontFamily: "var(--font-mono)",
            color: "rgba(255,255,255,0.7)",
          }}>9:16</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-mono)" }}>
              {intent.video.creator}
            </span>
            {intent.video.creatorVerified && (
              <Icon.Check size={11} style={{ color: ACCENT }} />
            )}
          </div>
          <div style={{
            fontSize: 12.5, color: "var(--fg-muted)",
            lineHeight: 1.4, marginTop: 4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {intent.video.description}
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            marginTop: 6,
            fontSize: 11, color: "var(--fg-faint)",
            fontFamily: "var(--font-mono)",
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
              <span>♫</span>
              <span style={{
                maxWidth: 180, overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{intent.video.sound}</span>
            </span>
            <span>·</span>
            <span>{formatViews(intent.video.views)} views</span>
          </div>
        </div>
      </div>

      {intent.replyingTo && (
        <div style={{
          margin: "0 14px 8px",
          padding: "8px 12px",
          background: "var(--bg-inset)",
          borderLeft: `3px solid ${ACCENT}`,
          borderRadius: "0 8px 8px 0",
          fontSize: 12.5, color: "var(--fg-muted)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 10.5, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>
              replying to
            </span>
            <span style={{ color: ACCENT, fontFamily: "var(--font-mono)", fontWeight: 600 }}>
              {intent.replyingTo.author}
            </span>
          </div>
          <div style={{ fontSize: 13, color: "var(--fg-muted)" }}>
            {intent.replyingTo.text}
          </div>
        </div>
      )}

      {/* Composer */}
      <div style={{ padding: "8px 14px 16px" }}>
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 10,
          padding: "10px 12px",
          background: "var(--bg-inset)",
          border: "1px solid var(--border)",
          borderRadius: 14,
        }}>
          <Avatar name="me" size={28} />
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Add a comment…"
            rows={3}
            style={{
              flex: 1, padding: 0,
              background: "transparent",
              border: 0, outline: 0,
              fontSize: 13.5, fontFamily: "var(--font-sans)",
              color: "var(--fg)", lineHeight: 1.5,
              minHeight: 48, display: "block",
              resize: "none",
            }}
          />
          <button aria-label="Emoji" style={{ color: "var(--fg-faint)", padding: 4 }}>
            <Icon.Smile size={16} />
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

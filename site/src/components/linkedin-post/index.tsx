import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { LINKEDIN_POST_DEFAULT } from "./types";
import type { LinkedInAudience, LinkedInIntent, LinkedInMedia, LinkedInPayload } from "./types";

export type { LinkedInIntent, LinkedInPayload, LinkedInAudience, LinkedInMedia } from "./types";
export { LINKEDIN_POST_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.10 240)";

const AUDIENCE_LABEL: Record<LinkedInAudience, string> = {
  anyone: "Anyone",
  connections: "Connections only",
  group: "Group",
};

export function LinkedInPost({
  intent = LINKEDIN_POST_DEFAULT,
  onResult,
}: {
  intent?: LinkedInIntent;
  onResult?: (r: ReviewResult<LinkedInPayload>) => void;
}) {
  const [body, setBody] = React.useState(intent.body);
  const [audience, setAudience] = React.useState<LinkedInAudience>(intent.audience ?? "anyone");
  const [hashtags, setHashtags] = React.useState<string[]>(intent.hashtags ?? []);
  const [media, setMedia] = React.useState<LinkedInMedia[]>(intent.media ?? []);
  const [shareToCompanies, setShareToCompanies] = React.useState<string[]>(intent.shareToCompanies ?? []);

  const original = React.useRef(intent);
  const edited =
    body !== original.current.body ||
    audience !== (original.current.audience ?? "anyone") ||
    JSON.stringify(hashtags) !== JSON.stringify(original.current.hashtags ?? []) ||
    JSON.stringify(media) !== JSON.stringify(original.current.media ?? []) ||
    JSON.stringify(shareToCompanies) !== JSON.stringify(original.current.shareToCompanies ?? []);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { body, audience, hashtags, media, shareToCompanies },
    summary: `LinkedIn · "${body.slice(0, 48)}${body.length > 48 ? "…" : ""}"`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "LinkedIn post cancelled" });

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
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--fg-faint)",
          }}>create a post</span>
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
          <div style={{ display: "flex", gap: 4 }}>
            <button
              onClick={() => setMedia([...media, { kind: "image", hue: Math.floor(Math.random() * 360) }])}
              aria-label="Add image"
              style={{ width: 30, height: 30, borderRadius: 8, color: "var(--fg-dim)" }}
            >
              <Icon.Image size={16} />
            </button>
            <button
              onClick={() => setMedia([...media, { kind: "document", hue: 200 }])}
              aria-label="Attach document"
              style={{ width: 30, height: 30, borderRadius: 8, color: "var(--fg-dim)" }}
            >
              <Icon.Paperclip size={16} />
            </button>
          </div>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            disabled={body.trim().length === 0}
            icon={<Icon.Send size={13} />}
            onClick={submit}
          >
            {edited ? "Post edited" : "Post"}
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

      {/* Profile card */}
      <div style={{
        padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Avatar name={intent.profile.name} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{intent.profile.name}</div>
          <div style={{
            fontSize: 12, color: "var(--fg-muted)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{intent.profile.headline}</div>
          <button
            onClick={() => {
              const order: LinkedInAudience[] = ["anyone", "connections", "group"];
              const next = order[(order.indexOf(audience) + 1) % order.length]!;
              setAudience(next);
            }}
            style={{
              marginTop: 4,
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "2px 8px",
              border: "1px solid var(--border)",
              borderRadius: 6,
              fontSize: 11, color: "var(--fg-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <Icon.Users size={11} />
            {AUDIENCE_LABEL[audience]}
            {audience === "group" && intent.groupName ? ` · ${intent.groupName}` : ""}
            <Icon.ChevronDown size={11} />
          </button>
        </div>
      </div>

      {/* Body */}
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        rows={10}
        placeholder="What do you want to talk about?"
        style={{
          width: "100%",
          padding: "0 16px 12px",
          background: "transparent",
          border: 0, outline: 0,
          fontSize: 14,
          fontFamily: "var(--font-sans)",
          color: "var(--fg)", lineHeight: 1.55,
          minHeight: 180, display: "block",
          resize: "vertical",
        }}
      />

      {/* Hashtags */}
      {hashtags.length > 0 && (
        <div style={{
          padding: "0 16px 12px",
          display: "flex", flexWrap: "wrap", gap: 6,
        }}>
          {hashtags.map(h => (
            <button
              key={h}
              onClick={() => setHashtags(hashtags.filter(x => x !== h))}
              style={{
                fontSize: 12, fontWeight: 500,
                padding: "2px 8px",
                background: `color-mix(in oklch, ${ACCENT} 12%, transparent)`,
                border: `1px solid color-mix(in oklch, ${ACCENT} 28%, transparent)`,
                borderRadius: 999,
                color: ACCENT,
              }}
            >#{h}</button>
          ))}
          <button
            style={{
              fontSize: 12, color: "var(--fg-faint)",
              padding: "2px 8px",
              border: "1px dashed var(--border-strong)",
              borderRadius: 999,
            }}
          >+ hashtag</button>
        </div>
      )}

      {/* Media */}
      {media.length > 0 && (
        <div style={{
          padding: "0 16px 14px",
          display: "grid",
          gridTemplateColumns: media.length === 1 ? "1fr" : "1fr 1fr",
          gap: 6,
        }}>
          {media.map((m, i) => (
            <div
              key={i}
              style={{
                aspectRatio: media.length === 1 ? "16 / 9" : "1 / 1",
                background: m.kind === "document"
                  ? "var(--bg-inset)"
                  : `linear-gradient(135deg, oklch(0.5 0.12 ${m.hue ?? 240}) 0%, oklch(0.32 0.08 ${(m.hue ?? 240) + 40}) 100%)`,
                borderRadius: 10,
                position: "relative",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: m.kind === "document" ? "var(--fg-muted)" : "oklch(0.96 0.04 240)",
                fontFamily: "var(--font-mono)", fontSize: 11,
                border: m.kind === "document" ? "1px solid var(--border)" : "0",
              }}
            >
              <span style={{ opacity: m.kind === "document" ? 1 : 0.6, display: "inline-flex", alignItems: "center", gap: 6 }}>
                {m.kind === "document" && <Icon.Paperclip size={13} />}
                {m.alt || m.kind}
              </span>
              <button
                onClick={() => setMedia(media.filter((_, idx) => idx !== i))}
                aria-label="remove media"
                style={{
                  position: "absolute", top: 6, right: 6,
                  width: 22, height: 22, borderRadius: 999,
                  background: "rgba(0,0,0,0.55)", color: "#fff",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Icon.X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Share to companies */}
      <div style={{
        padding: "10px 16px 12px",
        borderTop: "1px solid var(--border-faint)",
        display: "flex", alignItems: "center", gap: 10,
        fontSize: 12.5, color: "var(--fg-muted)",
      }}>
        <Icon.Layers size={13} style={{ color: "var(--fg-faint)" }} />
        <span>Also share to</span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(intent.shareToCompanies ?? ["Nordlight"]).map(co => {
            const on = shareToCompanies.includes(co);
            return (
              <button
                key={co}
                onClick={() => setShareToCompanies(on
                  ? shareToCompanies.filter(c => c !== co)
                  : [...shareToCompanies, co])}
                style={{
                  fontSize: 11.5,
                  padding: "2px 8px",
                  background: on
                    ? `color-mix(in oklch, ${ACCENT} 14%, transparent)`
                    : "var(--bg-inset)",
                  border: `1px solid ${on ? `color-mix(in oklch, ${ACCENT} 30%, transparent)` : "var(--border)"}`,
                  borderRadius: 999,
                  color: on ? ACCENT : "var(--fg-muted)",
                  fontWeight: 500,
                }}
              >
                {on && <Icon.Check size={10} style={{ marginRight: 4 }} />}
                {co}
              </button>
            );
          })}
        </div>
      </div>
    </ModalShell>
  );
}

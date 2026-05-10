import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { INSTAGRAM_POST_DEFAULT } from "./types";
import type { InstagramAudience, InstagramIntent, InstagramPayload } from "./types";

export type { InstagramIntent, InstagramPayload, InstagramAudience } from "./types";
export { INSTAGRAM_POST_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.16 320)";

export function InstagramPost({
  intent = INSTAGRAM_POST_DEFAULT,
  onResult,
}: {
  intent?: InstagramIntent;
  onResult?: (r: ReviewResult<InstagramPayload>) => void;
}) {
  const [caption, setCaption] = React.useState(intent.caption);
  const [hashtags, setHashtags] = React.useState<string[]>(intent.hashtags ?? []);
  const [location, setLocation] = React.useState(intent.location ?? "");
  const [audience, setAudience] = React.useState<InstagramAudience>(intent.audience ?? "public");
  const [shareToFacebook, setShareToFacebook] = React.useState(!!intent.shareToFacebook);

  const original = React.useRef(intent);
  const edited =
    caption !== original.current.caption ||
    JSON.stringify(hashtags) !== JSON.stringify(original.current.hashtags ?? []) ||
    location !== (original.current.location ?? "") ||
    audience !== (original.current.audience ?? "public") ||
    shareToFacebook !== !!original.current.shareToFacebook;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      caption, hashtags,
      location: location || undefined,
      audience, shareToFacebook,
    },
    summary: `Instagram · "${caption.slice(0, 48)}${caption.length > 48 ? "…" : ""}"`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Instagram post cancelled" });

  const hue = intent.imageHue ?? 320;

  return (
    <ModalShell
      width={680}
      accent={ACCENT}
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)", gap: 12,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
            new post
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
          <button
            onClick={() => setAudience(audience === "public" ? "close-friends" : "public")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: 11, fontFamily: "var(--font-mono)",
              color: audience === "close-friends" ? "var(--c-ok)" : "var(--fg-muted)",
              padding: "3px 8px",
              border: "1px solid " + (audience === "close-friends" ? "color-mix(in oklch, var(--c-ok) 30%, transparent)" : "var(--border)"),
              background: audience === "close-friends" ? "color-mix(in oklch, var(--c-ok) 10%, transparent)" : "var(--bg-inset)",
              borderRadius: 999,
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: 999,
              background: audience === "close-friends" ? "var(--c-ok)" : "var(--fg-faint)",
            }} />
            {audience === "close-friends" ? "Close friends" : "Public"}
          </button>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={submit}>
            {edited ? "Share edited" : "Share"}
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

      <div style={{
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        minHeight: 380,
      }}>
        {/* Image preview tile (square) */}
        <div style={{
          padding: 16,
          borderRight: "1px solid var(--border-faint)",
        }}>
          <div style={{
            aspectRatio: "1 / 1",
            borderRadius: 10,
            background: `linear-gradient(135deg, oklch(0.5 0.15 ${hue}) 0%, oklch(0.3 0.1 ${hue + 30}) 50%, oklch(0.5 0.15 ${hue + 60}) 100%)`,
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            padding: 16, position: "relative",
            overflow: "hidden",
          }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 10.5,
              color: "rgba(255,255,255,0.7)",
              padding: "3px 8px",
              background: "rgba(0,0,0,0.4)",
              borderRadius: 4,
            }}>
              {intent.imageAlt ?? "image"}
            </span>
            <span style={{
              position: "absolute", top: 12, right: 12,
              fontFamily: "var(--font-mono)", fontSize: 10,
              color: "rgba(255,255,255,0.7)",
            }}>1:1</span>
          </div>
        </div>

        {/* Composer */}
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar name={intent.handle} size={28} />
            <span style={{
              fontWeight: 600, fontSize: 13,
              fontFamily: "var(--font-mono)",
            }}>{intent.handle}</span>
          </div>

          <textarea
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Write a caption…"
            rows={6}
            style={{
              width: "100%", padding: "10px 12px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)",
              borderRadius: 10, outline: 0,
              fontSize: 13.5, fontFamily: "var(--font-sans)",
              color: "var(--fg)", lineHeight: 1.5,
              minHeight: 100, display: "block",
              resize: "vertical",
            }}
          />

          {/* Hashtags */}
          {hashtags.length > 0 && (
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 4,
            }}>
              {hashtags.map(h => (
                <button
                  key={h}
                  onClick={() => setHashtags(hashtags.filter(x => x !== h))}
                  style={{
                    fontSize: 11.5, padding: "2px 8px",
                    background: `color-mix(in oklch, ${ACCENT} 12%, transparent)`,
                    border: `1px solid color-mix(in oklch, ${ACCENT} 28%, transparent)`,
                    borderRadius: 999,
                    color: ACCENT, fontWeight: 500,
                  }}
                >#{h}</button>
              ))}
            </div>
          )}

          {/* Location */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 12px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)",
            borderRadius: 8,
          }}>
            <Icon.Hash size={13} style={{ color: ACCENT }} />
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Add location"
              style={{
                flex: 1, padding: 0,
                background: "transparent",
                border: 0, outline: 0,
                fontSize: 13, color: "var(--fg)",
              }}
            />
          </div>

          {/* Cross-post */}
          <label style={{
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 12.5, color: "var(--fg-muted)",
            cursor: "pointer",
            paddingTop: 4,
          }}>
            <input
              type="checkbox"
              checked={shareToFacebook}
              onChange={e => setShareToFacebook(e.target.checked)}
              style={{ accentColor: ACCENT }}
            />
            Also share to Facebook
          </label>
        </div>
      </div>
    </ModalShell>
  );
}

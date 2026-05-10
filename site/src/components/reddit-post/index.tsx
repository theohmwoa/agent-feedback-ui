import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { REDDIT_POST_DEFAULT } from "./types";
import type { RedditFlair, RedditIntent, RedditPostKind, RedditPostPayload } from "./types";

export type { RedditIntent, RedditPostPayload, RedditPostKind, RedditFlair } from "./types";
export { REDDIT_POST_DEFAULT } from "./types";

const ACCENT = "oklch(0.68 0.16 30)";
const TITLE_LIMIT = 300;

function formatSubs(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

export function RedditPost({
  intent = REDDIT_POST_DEFAULT,
  onResult,
}: {
  intent?: RedditIntent;
  onResult?: (r: ReviewResult<RedditPostPayload>) => void;
}) {
  const [kind, setKind] = React.useState<RedditPostKind>(intent.kind ?? "text");
  const [title, setTitle] = React.useState(intent.title);
  const [body, setBody] = React.useState(intent.body ?? "");
  const [url, setUrl] = React.useState(intent.url ?? "");
  const [flair, setFlair] = React.useState<RedditFlair | undefined>(intent.flair);
  const [nsfw, setNsfw] = React.useState(!!intent.nsfw);
  const [spoiler, setSpoiler] = React.useState(!!intent.spoiler);

  const original = React.useRef(intent);
  const edited =
    kind !== (original.current.kind ?? "text") ||
    title !== original.current.title ||
    body !== (original.current.body ?? "") ||
    url !== (original.current.url ?? "") ||
    JSON.stringify(flair) !== JSON.stringify(original.current.flair) ||
    nsfw !== !!original.current.nsfw ||
    spoiler !== !!original.current.spoiler;

  const titleOver = title.length > TITLE_LIMIT;

  const submit = () => {
    if (titleOver) return;
    onResult?.({
      kind: edited ? "edit" : "submit",
      payload: {
        subreddit: intent.subreddit,
        kind, title,
        body: kind === "text" ? body : undefined,
        url: kind === "link" ? url : undefined,
        flair, nsfw, spoiler,
      },
      summary: `${intent.subreddit} · ${title.slice(0, 56)}${title.length > 56 ? "…" : ""}`,
    });
  };
  const cancel = () => onResult?.({ kind: "cancel", summary: "Reddit post cancelled" });

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
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "2px 8px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 6,
            fontSize: 12, fontFamily: "var(--font-mono)",
            color: "var(--fg)",
          }}>
            <span style={{
              width: 18, height: 18, borderRadius: 999,
              background: ACCENT, color: "oklch(0.18 0.04 30)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 11,
            }}>r</span>
            {intent.subreddit}
            {intent.subscribers !== undefined && (
              <span style={{ color: "var(--fg-faint)" }}>· {formatSubs(intent.subscribers)}</span>
            )}
          </span>
          <div style={{ flex: 1 }} />
          {intent.rulesUrl && (
            <a
              href={intent.rulesUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 11, fontFamily: "var(--font-mono)",
                color: "var(--fg-faint)",
                display: "inline-flex", alignItems: "center", gap: 3,
              }}
            >
              rules <Icon.ExternalLink size={10} />
            </a>
          )}
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
            onClick={() => setNsfw(!nsfw)}
            style={{
              fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700,
              padding: "3px 8px", borderRadius: 999,
              background: nsfw ? "var(--c-err)" : "var(--bg-inset)",
              color: nsfw ? "#fff" : "var(--fg-faint)",
              border: nsfw ? "1px solid var(--c-err)" : "1px solid var(--border)",
            }}
          >NSFW</button>
          <button
            onClick={() => setSpoiler(!spoiler)}
            style={{
              fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700,
              padding: "3px 8px", borderRadius: 999,
              background: spoiler ? "var(--fg)" : "var(--bg-inset)",
              color: spoiler ? "var(--bg)" : "var(--fg-faint)",
              border: spoiler ? "1px solid var(--fg)" : "1px solid var(--border)",
            }}
          >SPOILER</button>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            disabled={titleOver || title.trim().length === 0}
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

      {/* Type tabs */}
      <div style={{
        display: "flex", gap: 4,
        padding: "10px 16px 0",
      }}>
        {(["text", "link", "image"] as RedditPostKind[]).map(k => (
          <button
            key={k}
            onClick={() => setKind(k)}
            style={{
              flex: 1, padding: "8px 12px",
              fontSize: 12.5, fontWeight: 500,
              color: kind === k ? ACCENT : "var(--fg-muted)",
              background: kind === k
                ? `color-mix(in oklch, ${ACCENT} 10%, transparent)`
                : "transparent",
              border: "1px solid " + (kind === k ? `color-mix(in oklch, ${ACCENT} 30%, transparent)` : "var(--border-faint)"),
              borderRadius: 8,
              textTransform: "capitalize",
            }}
          >{k}</button>
        ))}
      </div>

      {/* Title */}
      <div style={{ padding: "12px 16px 0" }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          style={{
            width: "100%", padding: "10px 12px",
            background: "var(--bg-inset)",
            border: "1px solid " + (titleOver ? "var(--c-err)" : "var(--border)"),
            borderRadius: 8, outline: 0,
            fontSize: 14, fontWeight: 500,
            color: "var(--fg)",
          }}
        />
        <div style={{
          marginTop: 4,
          display: "flex", justifyContent: "space-between",
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: titleOver ? "var(--c-err)" : "var(--fg-faint)",
        }}>
          <span>{title.length} / {TITLE_LIMIT}</span>
        </div>
      </div>

      {/* Flair picker */}
      {(intent.availableFlair?.length ?? 0) > 0 && (
        <div style={{
          padding: "0 16px 8px",
          display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
        }}>
          <Icon.Tag size={12} style={{ color: "var(--fg-faint)" }} />
          <span style={{ fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>flair:</span>
          {intent.availableFlair!.map(f => {
            const on = flair?.name === f.name;
            return (
              <button
                key={f.name}
                onClick={() => setFlair(on ? undefined : f)}
                style={{
                  fontSize: 11.5, padding: "2px 8px",
                  borderRadius: 999,
                  background: on ? f.bg : "var(--bg-inset)",
                  color: on ? (f.fg ?? "var(--fg)") : "var(--fg-muted)",
                  border: "1px solid " + (on ? f.bg : "var(--border)"),
                  fontWeight: 500,
                }}
              >
                {f.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Body / link / image stage */}
      <div style={{ padding: "8px 16px 16px" }}>
        {kind === "text" && (
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={9}
            placeholder="Text (optional)"
            style={{
              width: "100%", padding: "10px 12px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)",
              borderRadius: 8, outline: 0,
              fontSize: 13, lineHeight: 1.55,
              color: "var(--fg)", fontFamily: "var(--font-sans)",
              minHeight: 200, display: "block",
              resize: "vertical",
            }}
          />
        )}
        {kind === "link" && (
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="URL"
            style={{
              width: "100%", padding: "10px 12px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)",
              borderRadius: 8, outline: 0,
              fontSize: 13, fontFamily: "var(--font-mono)",
              color: "var(--fg)",
            }}
          />
        )}
        {kind === "image" && (
          <div style={{
            border: "1px dashed var(--border-strong)",
            borderRadius: 10,
            padding: 32,
            textAlign: "center",
            color: "var(--fg-faint)",
            fontSize: 13,
          }}>
            <Icon.Image size={20} style={{ color: "var(--fg-faint)", marginBottom: 6 }} />
            <div>Drop an image, or click to browse</div>
          </div>
        )}
      </div>
    </ModalShell>
  );
}

import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { TWITTER_POST_DEFAULT } from "./types";
import type { TwitterAudience, TwitterIntent, TwitterMedia, TwitterPayload } from "./types";

export type { TwitterIntent, TwitterPayload, TwitterAudience, TwitterMedia } from "./types";
export { TWITTER_POST_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.04 240)";
const LIMIT = 280;

const AUDIENCE_LABEL: Record<TwitterAudience, string> = {
  everyone: "Everyone",
  circle: "Trusted circle",
  followers: "Followers",
};

export function TwitterPost({
  intent = TWITTER_POST_DEFAULT,
  onResult,
}: {
  intent?: TwitterIntent;
  onResult?: (r: ReviewResult<TwitterPayload>) => void;
}) {
  const [body, setBody] = React.useState(intent.body);
  const [audience, setAudience] = React.useState<TwitterAudience>(intent.audience ?? "everyone");
  const [media, setMedia] = React.useState<TwitterMedia[]>(intent.media ?? []);
  const [poll, setPoll] = React.useState(intent.poll);
  const [scheduledAt, setScheduledAt] = React.useState(intent.scheduledAt ?? "");

  const original = React.useRef(intent);
  const edited =
    body !== original.current.body ||
    audience !== (original.current.audience ?? "everyone") ||
    JSON.stringify(media) !== JSON.stringify(original.current.media ?? []) ||
    JSON.stringify(poll) !== JSON.stringify(original.current.poll) ||
    scheduledAt !== (original.current.scheduledAt ?? "");

  const remaining = LIMIT - body.length;
  const overLimit = remaining < 0;
  const nearLimit = remaining <= 20 && !overLimit;
  const ringColor = overLimit ? "var(--c-err)" : nearLimit ? "var(--c-warn)" : ACCENT;
  // ring fraction
  const frac = Math.min(1, body.length / LIMIT);

  const submit = () => {
    if (overLimit) return;
    onResult?.({
      kind: edited ? "edit" : "submit",
      payload: { body, audience, media, poll, scheduledAt: scheduledAt || undefined },
      summary: `Tweet · "${body.slice(0, 48)}${body.length > 48 ? "…" : ""}"`,
    });
  };
  const cancel = () => onResult?.({ kind: "cancel", summary: "Tweet cancelled" });

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
          <div style={{ display: "flex", gap: 4, color: "var(--fg-dim)" }}>
            <button
              onClick={() => setMedia([...media, { kind: "image", hue: Math.floor(Math.random() * 360) }])}
              disabled={media.length >= 4}
              aria-label="Add image"
              style={{
                width: 28, height: 28, borderRadius: 8,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                color: media.length >= 4 ? "var(--fg-faint)" : ACCENT,
                opacity: media.length >= 4 ? 0.4 : 1,
              }}
            >
              <Icon.Image size={15} />
            </button>
            <button
              onClick={() => setPoll(poll ? undefined : { options: ["", ""], durationHours: 24 })}
              aria-label="Add poll"
              style={{
                width: 28, height: 28, borderRadius: 8,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                color: poll ? ACCENT : "var(--fg-dim)",
              }}
            >
              <Icon.List size={15} />
            </button>
            <button
              onClick={() => setScheduledAt(scheduledAt ? "" : "tomorrow-9")}
              aria-label="Schedule"
              style={{
                width: 28, height: 28, borderRadius: 8,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                color: scheduledAt ? ACCENT : "var(--fg-dim)",
              }}
            >
              <Icon.Calendar size={15} />
            </button>
          </div>
          <div style={{ flex: 1 }} />
          <CharRing frac={frac} color={ringColor} remaining={remaining} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            disabled={overLimit || body.trim().length === 0}
            icon={<Icon.Send size={13} />}
            onClick={submit}
          >
            {scheduledAt ? "Schedule" : edited ? "Post edited" : "Post"}
            <span style={{ marginLeft: 6, opacity: .55 }}>
              <Kbd>⌘</Kbd>
              <span style={{ marginLeft: 2 }}><Kbd>↵</Kbd></span>
            </span>
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

      {intent.replyingTo && (
        <div style={{
          padding: "10px 16px",
          borderBottom: "1px solid var(--border-faint)",
          fontSize: 12.5, color: "var(--fg-faint)",
        }}>
          Replying to <span style={{ color: ACCENT }}>{intent.replyingTo.handle}</span>
        </div>
      )}

      <div style={{ padding: "14px 16px", display: "flex", gap: 12 }}>
        <Avatar name={intent.displayName} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{intent.displayName}</span>
            <span style={{ fontSize: 12.5, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>
              {intent.handle}
            </span>
          </div>

          {/* Audience selector */}
          <button
            onClick={() => {
              const order: TwitterAudience[] = ["everyone", "followers", "circle"];
              const next = order[(order.indexOf(audience) + 1) % order.length]!;
              setAudience(next);
            }}
            style={{
              marginTop: 4, marginBottom: 8,
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "2px 10px",
              border: `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)`,
              background: `color-mix(in oklch, ${ACCENT} 10%, transparent)`,
              color: ACCENT,
              borderRadius: 999,
              fontSize: 11.5, fontWeight: 500,
            }}
          >
            <Icon.Users size={11} />
            {AUDIENCE_LABEL[audience]}
            <Icon.ChevronDown size={11} />
          </button>

          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="What's happening?"
            rows={4}
            style={{
              width: "100%",
              padding: "0", marginTop: 2,
              background: "transparent",
              border: 0, outline: 0,
              fontSize: 16,
              fontFamily: "var(--font-sans)",
              color: "var(--fg)", lineHeight: 1.45,
              minHeight: 96, display: "block",
            }}
          />

          {/* Media row */}
          {media.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: media.length === 1 ? "1fr" : "1fr 1fr",
              gap: 4,
              marginTop: 10,
              borderRadius: 14, overflow: "hidden",
              border: "1px solid var(--border-faint)",
            }}>
              {media.map((m, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: media.length === 1 ? "16 / 9" : "1 / 1",
                    background: `linear-gradient(135deg, oklch(0.5 0.12 ${m.hue ?? 200}) 0%, oklch(0.32 0.08 ${(m.hue ?? 200) + 40}) 100%)`,
                    position: "relative",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "oklch(0.96 0.04 240)",
                    fontFamily: "var(--font-mono)", fontSize: 11,
                  }}
                >
                  <span style={{ opacity: 0.6 }}>{m.kind}</span>
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

          {/* Poll */}
          {poll && (
            <div style={{
              marginTop: 10,
              border: "1px solid var(--border)",
              borderRadius: 12, padding: "10px 12px",
            }}>
              <div style={{
                fontSize: 11, fontFamily: "var(--font-mono)",
                color: "var(--fg-faint)", marginBottom: 8,
                textTransform: "uppercase", letterSpacing: 0.6,
              }}>poll · {poll.durationHours}h</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {poll.options.map((opt, i) => (
                  <input
                    key={i}
                    value={opt}
                    onChange={e => {
                      const next = [...poll.options];
                      next[i] = e.target.value;
                      setPoll({ ...poll, options: next });
                    }}
                    placeholder={`Option ${i + 1}`}
                    style={{
                      width: "100%", padding: "8px 10px",
                      background: "var(--bg-inset)",
                      border: "1px solid var(--border-faint)",
                      borderRadius: 8, outline: 0,
                      fontSize: 13, color: "var(--fg)",
                    }}
                  />
                ))}
                {poll.options.length < 4 && (
                  <button
                    onClick={() => setPoll({ ...poll, options: [...poll.options, ""] })}
                    style={{
                      fontSize: 12, color: ACCENT,
                      textAlign: "left", padding: "4px 0",
                    }}
                  >+ add option</button>
                )}
              </div>
            </div>
          )}

          {scheduledAt && (
            <div style={{
              marginTop: 10,
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 10px",
              border: `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)`,
              background: `color-mix(in oklch, ${ACCENT} 10%, transparent)`,
              borderRadius: 999,
              fontSize: 11.5, color: ACCENT,
              fontFamily: "var(--font-mono)",
            }}>
              <Icon.Calendar size={11} />
              scheduled · {scheduledAt}
              <button
                onClick={() => setScheduledAt("")}
                aria-label="cancel schedule"
                style={{ color: ACCENT, marginLeft: 2 }}
              >
                <Icon.X size={10} />
              </button>
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

function CharRing({ frac, color, remaining }: { frac: number; color: string; remaining: number }) {
  const r = 9;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <svg width="22" height="22" viewBox="0 0 22 22">
        <circle cx="11" cy="11" r={r} fill="none" stroke="var(--border)" strokeWidth="2" />
        <circle
          cx="11" cy="11" r={r}
          fill="none" stroke={color} strokeWidth="2"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(1, frac))}
          strokeLinecap="round"
          transform="rotate(-90 11 11)"
        />
      </svg>
      {(remaining <= 20) && (
        <span style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color, minWidth: 24, textAlign: "right",
        }}>{remaining}</span>
      )}
    </div>
  );
}

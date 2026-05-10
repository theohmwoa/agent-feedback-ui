import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { SEGMENT_DEFAULT } from "./types";
import type { SegmentDestination, SegmentIntent, SegmentPayload } from "./types";

export type { SegmentIntent, SegmentPayload, SegmentDestination } from "./types";
export { SEGMENT_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.13 165)";

export function SegmentTrackEvent({
  intent = SEGMENT_DEFAULT,
  onResult,
}: {
  intent?: SegmentIntent;
  onResult?: (r: ReviewResult<SegmentPayload>) => void;
}) {
  const [event, setEvent] = React.useState(intent.event);
  const [userId, setUserId] = React.useState(intent.userId ?? "");
  const [anonymousId, setAnonymousId] = React.useState(intent.anonymousId ?? "");
  const [identifyMode, setIdentifyMode] = React.useState<"user" | "anon">(
    intent.userId ? "user" : "anon",
  );
  const [properties, setProperties] = React.useState(intent.properties);
  const [destinations, setDestinations] = React.useState<SegmentDestination[]>(intent.destinations);
  const [showSuggest, setShowSuggest] = React.useState(false);

  const edited =
    event !== intent.event ||
    userId !== (intent.userId ?? "") ||
    anonymousId !== (intent.anonymousId ?? "") ||
    properties !== intent.properties ||
    JSON.stringify(destinations) !== JSON.stringify(intent.destinations);

  const submit = () => {
    const integrations = destinations.reduce<Record<string, boolean>>((acc, d) => {
      acc[d.id] = d.enabled;
      return acc;
    }, {});
    onResult?.({
      kind: edited ? "edit" : "submit",
      payload: {
        source: intent.source, event,
        userId: identifyMode === "user" ? userId || undefined : undefined,
        anonymousId: identifyMode === "anon" ? anonymousId || undefined : undefined,
        properties, integrations,
      },
      summary: `track ${event}`,
    });
  };
  const cancel = () => onResult?.({ kind: "cancel", summary: `track ${event} cancelled` });

  const toggleDest = (id: string) => {
    setDestinations(destinations.map(d => d.id === id ? { ...d, enabled: !d.enabled } : d));
  };

  const eventSuggestions = (intent.knownEvents ?? []).filter(
    e => e !== event && e.toLowerCase().includes(event.toLowerCase()),
  );

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
            display: "inline-flex", alignItems: "center", gap: 4,
            fontFamily: "var(--font-mono)", fontSize: 11.5,
            color: "var(--fg-muted)",
            padding: "2px 8px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 6,
          }}>
            {intent.workspace}<span style={{ color: "var(--fg-faint)" }}>·</span>{intent.source}
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
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
            → {destinations.filter(d => d.enabled).length} of {destinations.length} destinations
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Track edited" : "Track event"}
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

      {/* Event name */}
      <div style={{ padding: "16px 18px 8px", position: "relative" }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 6,
        }}>Event</div>
        <input
          value={event}
          onChange={e => { setEvent(e.target.value); setShowSuggest(true); }}
          onFocus={() => setShowSuggest(true)}
          onBlur={() => setTimeout(() => setShowSuggest(false), 100)}
          style={{
            width: "100%", height: 36, padding: "0 12px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 8,
            outline: 0,
            fontSize: 14, fontWeight: 500,
            color: "var(--fg)",
          }}
        />
        {showSuggest && eventSuggestions.length > 0 && (
          <div style={{
            position: "absolute",
            left: 18, right: 18, top: "calc(100% - 4px)",
            background: "var(--bg-card)",
            border: "1px solid var(--border)", borderRadius: 8,
            boxShadow: "0 12px 30px -8px rgb(0 0 0 / .55)",
            zIndex: 10,
          }}>
            {eventSuggestions.slice(0, 5).map(s => (
              <button
                key={s}
                onMouseDown={() => { setEvent(s); setShowSuggest(false); }}
                style={{
                  display: "block", width: "100%", padding: "8px 12px",
                  textAlign: "left", fontSize: 12.5,
                  color: "var(--fg)",
                  background: "transparent",
                }}
              >
                <Icon.Search size={11} style={{ color: "var(--fg-faint)", marginRight: 8 }} />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Identify */}
      <div style={{ padding: "8px 18px" }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 6,
        }}>Identify as</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            display: "flex", padding: 2,
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 8,
          }}>
            {(["user", "anon"] as const).map(m => (
              <button
                key={m}
                onClick={() => setIdentifyMode(m)}
                style={{
                  height: 24, padding: "0 10px",
                  fontSize: 11.5, fontFamily: "var(--font-mono)",
                  background: identifyMode === m ? "var(--bg-card)" : "transparent",
                  color: identifyMode === m ? "var(--fg)" : "var(--fg-muted)",
                  border: "1px solid " + (identifyMode === m ? "var(--border)" : "transparent"),
                  borderRadius: 6,
                }}
              >
                {m === "user" ? "userId" : "anonymousId"}
              </button>
            ))}
          </div>
          {identifyMode === "user" ? (
            <input
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder="u_..."
              style={{
                flex: 1, height: 28, padding: "0 10px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border)", borderRadius: 6,
                fontFamily: "var(--font-mono)", fontSize: 12,
                color: "var(--fg)", outline: 0,
              }}
            />
          ) : (
            <input
              value={anonymousId}
              onChange={e => setAnonymousId(e.target.value)}
              placeholder="anon-..."
              style={{
                flex: 1, height: 28, padding: "0 10px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border)", borderRadius: 6,
                fontFamily: "var(--font-mono)", fontSize: 12,
                color: "var(--fg)", outline: 0,
              }}
            />
          )}
        </div>
      </div>

      {/* Properties */}
      <div style={{ padding: "12px 18px 8px" }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 6,
        }}>Properties</div>
        <textarea
          value={properties}
          onChange={e => setProperties(e.target.value)}
          rows={6}
          style={{
            width: "100%", padding: "12px 14px",
            background: "var(--code-bg)",
            border: "1px solid var(--border)",
            borderRadius: 10, outline: 0,
            fontFamily: "var(--font-mono)", fontSize: 12.5,
            color: "var(--code-fg)", lineHeight: 1.6,
            minHeight: 130, display: "block",
            caretColor: "var(--agent-ui-accent)",
          }}
        />
      </div>

      {/* Destinations */}
      <div style={{ padding: "8px 18px 16px" }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 8,
        }}>Destinations</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {destinations.map(d => (
            <button
              key={d.id}
              onClick={() => toggleDest(d.id)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                height: 26, padding: "0 10px",
                fontSize: 12, fontFamily: "var(--font-mono)",
                color: d.enabled ? d.color : "var(--fg-faint)",
                background: d.enabled
                  ? `color-mix(in oklch, ${d.color} 14%, transparent)`
                  : "transparent",
                border: `1px solid ${d.enabled
                  ? `color-mix(in oklch, ${d.color} 30%, transparent)`
                  : "var(--border)"}`,
                borderRadius: 999,
                textDecoration: d.enabled ? "none" : "line-through",
              }}
            >
              <span style={{
                width: 6, height: 6, borderRadius: 999,
                background: d.enabled ? d.color : "var(--fg-faint)",
              }} />
              {d.name}
            </button>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}

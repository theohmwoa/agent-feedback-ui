import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { RECURRING_DEFAULT } from "./types";
import type { RecurringChange, RecurringIntent, RecurringPayload, RecurringScope } from "./types";

export type {
  RecurringIntent, RecurringPayload, RecurringScope, RecurringChange,
} from "./types";
export { RECURRING_DEFAULT } from "./types";

const ACCENT = "oklch(0.74 0.12 60)";

const SCOPE_LABEL: Record<RecurringScope, string> = {
  this:      "This event",
  following: "This and following",
  all:       "All events",
};

const SCOPE_DESCRIPTION: Record<RecurringScope, string> = {
  this:      "Modify only the selected occurrence.",
  following: "Modify this occurrence and every future occurrence.",
  all:       "Modify the entire series — past and future.",
};

export function RecurringEventEdit({
  intent = RECURRING_DEFAULT,
  onResult,
}: {
  intent?: RecurringIntent;
  onResult?: (r: ReviewResult<RecurringPayload>) => void;
}) {
  const [scope, setScope] = React.useState<RecurringScope>(intent.defaultScope ?? "this");
  const edited = scope !== (intent.defaultScope ?? "this");

  const affected = scope === "this" ? 1
    : scope === "following" ? Math.max(1, Math.floor(intent.totalOccurrences / 2))
    : intent.totalOccurrences;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { scope, changes: intent.changes, affectedOccurrences: affected },
    summary: `${intent.title} · ${SCOPE_LABEL[scope]} · ${affected} occurrence${affected === 1 ? "" : "s"}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Recurring edit cancelled" });

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
          <span style={{
            fontSize: 11, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)",
          }}>recurring · edit</span>
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
            affects · <span style={{ color: ACCENT }}>{affected}</span> of {intent.totalOccurrences}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">scope changed</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            Apply changes
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

      {/* Title (read-only) */}
      <div style={{ padding: "16px 18px 8px" }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          textTransform: "uppercase", letterSpacing: 0.6,
          marginBottom: 6,
        }}>Editing</div>
        <div style={{ fontSize: 19, fontWeight: 600, color: "var(--fg)", letterSpacing: -0.2 }}>
          {intent.title}
        </div>
        <div style={{
          fontSize: 12, color: "var(--fg-muted)",
          marginTop: 4, fontFamily: "var(--font-mono)",
        }}>
          {intent.series} · {intent.occurrence}
        </div>
      </div>

      {/* Changed fields preview */}
      <div style={{ padding: "8px 18px 12px" }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          textTransform: "uppercase", letterSpacing: 0.6,
          marginBottom: 8,
        }}>
          {intent.changes.length} change{intent.changes.length === 1 ? "" : "s"} proposed
        </div>
        <div style={{
          background: "var(--bg-inset)",
          border: "1px solid var(--border-faint)",
          borderRadius: 10,
          overflow: "hidden",
        }}>
          {intent.changes.map((c, i) => (
            <div key={c.field} style={{
              display: "grid",
              gridTemplateColumns: "100px 1fr 16px 1fr",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderTop: i === 0 ? 0 : "1px solid var(--border-faint)",
              fontSize: 12.5,
            }}>
              <span style={{
                fontSize: 11,
                color: "var(--fg-faint)",
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
                letterSpacing: 0.6,
              }}>{c.field}</span>
              <span style={{
                color: "var(--c-err)",
                textDecoration: "line-through",
                fontFamily: "var(--font-mono)",
              }}>{c.before}</span>
              <Icon.ArrowRight size={12} style={{ color: "var(--fg-faint)" }} />
              <span style={{
                color: ACCENT,
                fontWeight: 500,
                fontFamily: "var(--font-mono)",
              }}>{c.after}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scope selector */}
      <div style={{ padding: "0 18px 18px" }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          textTransform: "uppercase", letterSpacing: 0.6,
          marginBottom: 8,
        }}>Apply to…</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {(["this", "following", "all"] as RecurringScope[]).map(s => {
            const active = scope === s;
            return (
              <button
                key={s}
                onClick={() => setScope(s)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px",
                  background: active
                    ? `color-mix(in oklch, ${ACCENT} 14%, transparent)`
                    : "var(--bg-inset)",
                  border: `1px solid ${active ? `color-mix(in oklch, ${ACCENT} 40%, transparent)` : "var(--border)"}`,
                  borderRadius: 10,
                  textAlign: "left", color: "var(--fg)",
                  cursor: "pointer",
                }}
              >
                <span style={{
                  width: 16, height: 16, borderRadius: 999,
                  border: `2px solid ${active ? ACCENT : "var(--border-strong)"}`,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  background: active ? `color-mix(in oklch, ${ACCENT} 60%, transparent)` : "transparent",
                }}>
                  {active && (
                    <span style={{
                      width: 6, height: 6, borderRadius: 999,
                      background: "var(--bg-card)",
                    }} />
                  )}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{SCOPE_LABEL[s]}</div>
                  <div style={{ fontSize: 11, color: "var(--fg-faint)", marginTop: 1 }}>
                    {SCOPE_DESCRIPTION[s]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </ModalShell>
  );
}

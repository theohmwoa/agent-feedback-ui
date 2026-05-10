import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { DD_DEFAULT } from "./types";
import type { DdIntent, DdMonitorState, DdMuteDuration, DdPayload } from "./types";

export type { DdIntent, DdPayload, DdMonitorState, DdMuteDuration, DdMonitorType } from "./types";
export { DD_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.13 280)";

const STATE_TONE: Record<DdMonitorState, { fg: string; label: string }> = {
  alert: { fg: "var(--c-err)",  label: "ALERT" },
  warn:  { fg: "var(--c-warn)", label: "WARN"  },
  ok:    { fg: "var(--c-ok)",   label: "OK"    },
};

const DURATION_LABEL: Record<DdMuteDuration, string> = {
  "5m":   "5m",
  "1h":   "1h",
  "4h":   "4h",
  "1d":   "1d",
  indef:  "until manually",
};
const DURATION_OPTIONS: DdMuteDuration[] = ["5m", "1h", "4h", "1d", "indef"];

export function DatadogAlertMute({
  intent = DD_DEFAULT,
  onResult,
}: {
  intent?: DdIntent;
  onResult?: (r: ReviewResult<DdPayload>) => void;
}) {
  const [duration, setDuration] = React.useState<DdMuteDuration>(intent.defaultDuration ?? "1h");
  const [reason, setReason] = React.useState(intent.defaultReason ?? "");
  const [scope, setScope] = React.useState<string[]>(intent.tagScope);
  const [createIncident, setCreateIncident] = React.useState(false);

  const edited =
    duration !== (intent.defaultDuration ?? "1h") ||
    reason !== (intent.defaultReason ?? "") ||
    JSON.stringify(scope) !== JSON.stringify(intent.tagScope) ||
    createIncident;

  const t = STATE_TONE[intent.state];

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      monitorId: intent.monitorId,
      duration, reason, scope, createIncident,
    },
    summary: `Mute ${intent.monitorName.slice(0, 40)} · ${DURATION_LABEL[duration]}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Mute cancelled" });

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
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--fg-faint)",
          }}>monitor #{intent.monitorId}</span>
          <div style={{ flex: 1 }} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: t.fg,
            padding: "2px 8px",
            border: `1px solid color-mix(in oklch, ${t.fg} 30%, transparent)`,
            background: `color-mix(in oklch, ${t.fg} 10%, transparent)`,
            borderRadius: 6, fontWeight: 700,
          }}>{t.label}</span>
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
          {(intent.recentTriggers ?? 0) > 0 && (
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
              fired {intent.recentTriggers}× last 30m
            </span>
          )}
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Lock size={13} />} onClick={submit}>
            {edited ? "Mute edited" : `Mute ${DURATION_LABEL[duration]}`}
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

      <div style={{ padding: "16px 18px" }}>
        <div style={{
          fontSize: 14, fontWeight: 600, lineHeight: 1.4, color: "var(--fg)",
          marginBottom: 4,
        }}>{intent.monitorName}</div>
        <div style={{
          fontSize: 11.5, fontFamily: "var(--font-mono)", color: "var(--fg-faint)",
          textTransform: "uppercase", letterSpacing: 0.4,
        }}>
          {intent.type} monitor
        </div>
      </div>

      {/* Scope */}
      <div style={{
        padding: "12px 18px",
        borderTop: "1px solid var(--border-faint)",
      }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          textTransform: "uppercase", letterSpacing: 0.6,
          color: "var(--fg-faint)", marginBottom: 8,
        }}>Tag scope</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {scope.map(t => (
            <button
              key={t}
              onClick={() => setScope(scope.filter(x => x !== t))}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontFamily: "var(--font-mono)", fontSize: 12,
                padding: "3px 8px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                color: "var(--fg-muted)",
              }}
            >
              {t}
              <Icon.X size={10} style={{ color: "var(--fg-faint)" }} />
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div style={{
        padding: "12px 18px",
        borderTop: "1px solid var(--border-faint)",
      }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          textTransform: "uppercase", letterSpacing: 0.6,
          color: "var(--fg-faint)", marginBottom: 8,
        }}>Duration</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {DURATION_OPTIONS.map(d => {
            const active = duration === d;
            return (
              <button
                key={d}
                onClick={() => setDuration(d)}
                style={{
                  height: 28, padding: "0 12px",
                  fontSize: 12, fontFamily: "var(--font-mono)",
                  background: active
                    ? `color-mix(in oklch, ${ACCENT} 16%, transparent)`
                    : "var(--bg-inset)",
                  border: `1px solid ${active ? ACCENT : "var(--border)"}`,
                  color: active ? ACCENT : "var(--fg-muted)",
                  borderRadius: 6,
                }}
              >
                {DURATION_LABEL[d]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reason */}
      <div style={{
        padding: "12px 18px",
        borderTop: "1px solid var(--border-faint)",
      }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          textTransform: "uppercase", letterSpacing: 0.6,
          color: "var(--fg-faint)", marginBottom: 8,
        }}>Reason</div>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          rows={3}
          placeholder="Why is this being muted? (visible in audit log)"
          style={{
            width: "100%", padding: "10px 12px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 13, color: "var(--fg)", lineHeight: 1.5,
            outline: 0,
          }}
        />
      </div>

      {/* Create incident toggle */}
      <div style={{
        padding: "12px 18px",
        borderTop: "1px solid var(--border-faint)",
      }}>
        <label style={{
          display: "flex", alignItems: "center", gap: 10,
          fontSize: 13, color: "var(--fg-muted)", cursor: "pointer",
        }}>
          <input
            type="checkbox"
            checked={createIncident}
            onChange={e => setCreateIncident(e.target.checked)}
            style={{ accentColor: ACCENT }}
          />
          <span>Also open a Datadog incident for tracking</span>
        </label>
      </div>
    </ModalShell>
  );
}

import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { SP_DEFAULT } from "./types";
import type { SpComponent, SpImpact, SpIntent, SpPayload, SpStatus } from "./types";

export type { SpIntent, SpPayload, SpStatus, SpImpact, SpComponent } from "./types";
export { SP_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.13 280)";

const STATUS_META: Record<SpStatus, { label: string; color: string }> = {
  investigating: { label: "Investigating", color: "var(--c-warn)" },
  identified:    { label: "Identified",    color: "oklch(0.74 0.13 60)" },
  monitoring:    { label: "Monitoring",    color: "oklch(0.7 0.1 240)" },
  resolved:      { label: "Resolved",      color: "var(--c-ok)" },
};
const STATUS_OPTIONS: SpStatus[] = ["investigating", "identified", "monitoring", "resolved"];

const IMPACT_META: Record<SpImpact, { label: string; color: string }> = {
  none:     { label: "None",     color: "var(--fg-faint)" },
  minor:    { label: "Minor",    color: "var(--c-warn)" },
  major:    { label: "Major",    color: "oklch(0.7 0.16 50)" },
  critical: { label: "Critical", color: "var(--c-err)" },
};
const IMPACT_OPTIONS: SpImpact[] = ["none", "minor", "major", "critical"];

export function StatuspageIncidentCreate({
  intent = SP_DEFAULT,
  onResult,
}: {
  intent?: SpIntent;
  onResult?: (r: ReviewResult<SpPayload>) => void;
}) {
  const [title, setTitle] = React.useState(intent.title);
  const [status, setStatus] = React.useState<SpStatus>(intent.status);
  const [impact, setImpact] = React.useState<SpImpact>(intent.impact);
  const [components, setComponents] = React.useState<SpComponent[]>(intent.components);
  const [message, setMessage] = React.useState(intent.message);
  const [notify, setNotify] = React.useState(intent.defaultNotify ?? true);

  const edited =
    title !== intent.title ||
    status !== intent.status ||
    impact !== intent.impact ||
    JSON.stringify(components) !== JSON.stringify(intent.components) ||
    message !== intent.message ||
    notify !== (intent.defaultNotify ?? true);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      pageId: intent.pageId, title, status, impact,
      componentIds: components.filter(c => c.selected).map(c => c.id),
      message,
      notifySubscribers: notify,
    },
    summary: `${STATUS_META[status].label} · ${title.slice(0, 40)}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Statuspage incident cancelled" });

  const toggleComp = (id: string) => {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
  };

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
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--fg-faint)" }}>
            {intent.pageName}
          </span>
          <div style={{ flex: 1 }} />
          {notify && (intent.subscriberCount ?? 0) > 0 && (
            <Pill tone="warn" size="sm" icon={<Icon.Send size={11} />}>
              notify {intent.subscriberCount!.toLocaleString()}
            </Pill>
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
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
            this is a public action
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.AlertTriangle size={13} />} onClick={submit}>
            {edited ? "Publish edited" : "Publish incident"}
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

      <div style={{ padding: "14px 18px" }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Incident title"
          style={{
            width: "100%", padding: "8px 0",
            background: "transparent",
            border: 0, borderBottom: "1px solid var(--border-faint)",
            outline: 0,
            fontSize: 18, fontWeight: 600,
            color: "var(--fg)",
          }}
        />
      </div>

      {/* Status + Impact */}
      <div style={{ padding: "10px 18px 14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <ChipGroup
          label="Status"
          value={status}
          options={STATUS_OPTIONS}
          meta={STATUS_META}
          onChange={v => setStatus(v as SpStatus)}
        />
        <ChipGroup
          label="Impact"
          value={impact}
          options={IMPACT_OPTIONS}
          meta={IMPACT_META}
          onChange={v => setImpact(v as SpImpact)}
        />
      </div>

      {/* Components */}
      <div style={{
        padding: "12px 18px",
        borderTop: "1px solid var(--border-faint)",
      }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          textTransform: "uppercase", letterSpacing: 0.6,
          color: "var(--fg-faint)", marginBottom: 8,
        }}>Affected components</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {components.map(c => {
            const active = !!c.selected;
            return (
              <button
                key={c.id}
                onClick={() => toggleComp(c.id)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  height: 28, padding: "0 10px",
                  fontSize: 12,
                  background: active ? `color-mix(in oklch, ${ACCENT} 14%, transparent)` : "var(--bg-inset)",
                  border: `1px solid ${active ? ACCENT : "var(--border)"}`,
                  borderRadius: 999,
                  color: active ? ACCENT : "var(--fg-muted)",
                }}
              >
                <span style={{
                  width: 12, height: 12, borderRadius: 3,
                  background: active ? ACCENT : "transparent",
                  border: `1px solid ${active ? ACCENT : "var(--border-strong)"}`,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  color: "var(--bg)",
                }}>
                  {active && <Icon.Check size={9} />}
                </span>
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Message */}
      <div style={{
        padding: "12px 18px",
        borderTop: "1px solid var(--border-faint)",
      }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          textTransform: "uppercase", letterSpacing: 0.6,
          color: "var(--fg-faint)", marginBottom: 8,
        }}>Message</div>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={6}
          style={{
            width: "100%", padding: "10px 12px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            outline: 0,
            fontSize: 13, lineHeight: 1.55, color: "var(--fg)",
          }}
        />
      </div>

      {/* Notify */}
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
            checked={notify}
            onChange={e => setNotify(e.target.checked)}
            style={{ accentColor: ACCENT }}
          />
          <span>
            Notify subscribers
            {(intent.subscriberCount ?? 0) > 0 && (
              <span style={{ color: "var(--fg-faint)", marginLeft: 6, fontFamily: "var(--font-mono)", fontSize: 11.5 }}>
                ({intent.subscriberCount!.toLocaleString()} email/SMS)
              </span>
            )}
          </span>
        </label>
      </div>
    </ModalShell>
  );
}

function ChipGroup<T extends string>({
  label, value, options, meta, onChange,
}: {
  label: string;
  value: T;
  options: T[];
  meta: Record<T, { label: string; color: string }>;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <div style={{
        fontSize: 10.5, fontFamily: "var(--font-mono)",
        textTransform: "uppercase", letterSpacing: 0.6,
        color: "var(--fg-faint)", marginBottom: 8,
      }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {options.map(o => {
          const m = meta[o];
          const active = value === o;
          return (
            <button
              key={o}
              onClick={() => onChange(o)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                height: 26, padding: "0 8px",
                fontSize: 11.5,
                background: active ? `color-mix(in oklch, ${m.color} 16%, transparent)` : "var(--bg-inset)",
                border: `1px solid ${active ? m.color : "var(--border)"}`,
                color: active ? m.color : "var(--fg-muted)",
                borderRadius: 6,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: 999, background: m.color }} />
              {m.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

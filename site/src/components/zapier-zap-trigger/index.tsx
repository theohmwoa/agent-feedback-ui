import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { ZAPIER_DEFAULT } from "./types";
import type { ZapField, ZapStep, ZapierIntent, ZapierPayload } from "./types";

export type { ZapierIntent, ZapierPayload, ZapField, ZapStep } from "./types";
export { ZAPIER_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.16 30)";

export function ZapierZapTrigger({
  intent = ZAPIER_DEFAULT,
  onResult,
}: {
  intent?: ZapierIntent;
  onResult?: (r: ReviewResult<ZapierPayload>) => void;
}) {
  const [fields, setFields] = React.useState<ZapField[]>(intent.fields);
  const [skipFilters, setSkipFilters] = React.useState(!!intent.skipFilters);

  const edited =
    JSON.stringify(fields) !== JSON.stringify(intent.fields) ||
    skipFilters !== !!intent.skipFilters;

  const submit = () => {
    const fieldMap = fields.reduce<Record<string, string>>((acc, f) => {
      acc[f.name] = f.value;
      return acc;
    }, {});
    onResult?.({
      kind: edited ? "edit" : "submit",
      payload: { zapId: intent.zapId, fields: fieldMap, skipFilters },
      summary: `Zap ${intent.zapId} · ${intent.zapTitle.slice(0, 40)}…`,
    });
  };
  const cancel = () => onResult?.({ kind: "cancel", summary: "Zap run cancelled" });

  const updateField = (i: number, value: string) => {
    const next = [...fields];
    next[i] = { ...next[i]!, value };
    setFields(next);
  };

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
            fontFamily: "var(--font-mono)", fontSize: 11.5,
            color: "var(--fg-faint)",
          }}>zap · {intent.zapId}</span>
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
          {intent.lastRunAt && (
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
              last run: <span style={{ color: intent.lastRunStatus === "error" ? "var(--c-err)" : "var(--c-ok)" }}>
                {intent.lastRunStatus ?? "—"}
              </span>
              <span style={{ marginLeft: 4 }}>· {intent.lastRunAt}</span>
            </span>
          )}
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Run edited" : "Run zap"}
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

      {/* Zap card */}
      <div style={{ padding: "16px 18px 12px" }}>
        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3, marginBottom: 12 }}>
          {intent.zapTitle}
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px",
          background: "var(--bg-inset)",
          border: "1px solid var(--border)", borderRadius: 10,
        }}>
          <AppCircle step={intent.trigger} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500 }}>{intent.trigger.app}</div>
            <div style={{
              fontSize: 11, color: "var(--fg-muted)",
              fontFamily: "var(--font-mono)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{intent.trigger.action}</div>
          </div>
          <Icon.ArrowRight size={14} style={{ color: "var(--fg-faint)" }} />
          <div style={{ flex: 1, minWidth: 0, textAlign: "right" }}>
            <div style={{ fontSize: 12, fontWeight: 500 }}>{intent.outcome.app}</div>
            <div style={{
              fontSize: 11, color: "var(--fg-muted)",
              fontFamily: "var(--font-mono)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{intent.outcome.action}</div>
          </div>
          <AppCircle step={intent.outcome} />
        </div>
      </div>

      {/* Fields */}
      <div style={{ padding: "0 18px 12px" }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 8,
        }}>
          Input · {fields.length} field{fields.length === 1 ? "" : "s"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {fields.map((f, i) => (
            <div key={f.name}>
              <div style={{
                display: "flex", alignItems: "baseline", gap: 6,
                fontSize: 11, color: "var(--fg-faint)",
                marginBottom: 4,
              }}>
                <span>{f.label}</span>
                {f.required && (
                  <span style={{ color: "var(--c-warn)", fontFamily: "var(--font-mono)" }}>*</span>
                )}
              </div>
              <input
                value={f.value}
                onChange={e => updateField(i, e.target.value)}
                style={{
                  width: "100%", height: 32, padding: "0 10px",
                  background: "var(--bg-inset)",
                  border: "1px solid var(--border)", borderRadius: 8,
                  outline: 0, fontSize: 13, color: "var(--fg)",
                  fontFamily: "var(--font-mono)",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Skip filters */}
      <div style={{
        padding: "10px 18px 16px",
        borderTop: "1px solid var(--border-faint)",
      }}>
        <label style={{
          display: "flex", alignItems: "center", gap: 10,
          fontSize: 12.5, color: "var(--fg-muted)",
          cursor: "pointer",
        }}>
          <input
            type="checkbox"
            checked={skipFilters}
            onChange={e => setSkipFilters(e.target.checked)}
            style={{ accentColor: ACCENT }}
          />
          <span>Skip filter steps</span>
          <span style={{ color: "var(--fg-faint)", fontSize: 11 }}>
            · forces every action to run regardless of conditions
          </span>
        </label>
      </div>
    </ModalShell>
  );
}

function AppCircle({ step }: { step: ZapStep }) {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: `color-mix(in oklch, ${step.appColor} 30%, var(--bg-card))`,
      border: `1px solid color-mix(in oklch, ${step.appColor} 40%, transparent)`,
      color: step.appColor,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13,
      flexShrink: 0,
    }}>{step.appShort}</div>
  );
}

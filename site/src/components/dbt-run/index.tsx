import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { DBT_DEFAULT } from "./types";
import type { DbtIntent, DbtPayload, DbtTarget } from "./types";

export type { DbtIntent, DbtPayload, DbtTarget } from "./types";
export { DBT_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.18 25)";

const TARGETS: DbtTarget[] = ["dev", "staging", "prod"];

const TARGET_TONE: Record<DbtTarget, string> = {
  dev:     "var(--c-ok)",
  staging: "var(--c-warn)",
  prod:    "var(--c-err)",
};

export function DbtRun({
  intent = DBT_DEFAULT,
  onResult,
}: {
  intent?: DbtIntent;
  onResult?: (r: ReviewResult<DbtPayload>) => void;
}) {
  const [target, setTarget] = React.useState<DbtTarget>(intent.target);
  const [selector, setSelector] = React.useState(intent.selector);
  const [exclude, setExclude] = React.useState(intent.exclude ?? "");
  const [fullRefresh, setFullRefresh] = React.useState(intent.fullRefresh);
  const [confirmText, setConfirmText] = React.useState("");

  const edited =
    target !== intent.target ||
    selector !== intent.selector ||
    exclude !== (intent.exclude ?? "") ||
    fullRefresh !== intent.fullRefresh;

  const isDangerous = (target === "prod" && fullRefresh);
  const confirmed = !isDangerous || confirmText === intent.project;

  const submit = () => {
    if (!confirmed) return;
    onResult?.({
      kind: edited ? "edit" : "submit",
      payload: {
        project: intent.project,
        target, selector,
        exclude: exclude || undefined,
        fullRefresh,
      },
      summary: `dbt run ${target} · ${selector}${fullRefresh ? " --full-refresh" : ""}`,
    });
  };
  const cancel = () => onResult?.({ kind: "cancel", summary: "dbt run cancelled" });

  return (
    <ModalShell
      width={680}
      accent={ACCENT}
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)", gap: 10,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: "var(--fg-muted)",
            padding: "2px 8px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 6,
          }}>
            <Icon.Layers size={12} />
            {intent.project}
          </span>
          <div style={{ flex: 1 }} />
          {target === "prod" && <Pill tone="warn" size="sm">production</Pill>}
          {fullRefresh && <Pill tone="err" size="sm">full-refresh</Pill>}
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
            {intent.expectedModels !== undefined && (
              <>~{intent.expectedModels} models</>
            )}
            {intent.expectedTests !== undefined && (
              <> · {intent.expectedTests} tests</>
            )}
            {intent.estimatedRuntimeMin !== undefined && (
              <> · ~{intent.estimatedRuntimeMin}m</>
            )}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant={isDangerous ? "danger" : "primary"}
            size="sm"
            disabled={!confirmed}
            icon={<Icon.Send size={13} />}
            onClick={submit}
          >
            {isDangerous ? "Run anyway" : edited ? "Run edited" : "Run dbt"}
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

      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Target picker */}
        <Field label="Target">
          <div style={{ display: "flex", gap: 4 }}>
            {TARGETS.map(tg => {
              const active = target === tg;
              const tone = TARGET_TONE[tg];
              return (
                <button
                  key={tg}
                  onClick={() => setTarget(tg)}
                  style={{
                    padding: "5px 14px",
                    fontSize: 12.5, fontFamily: "var(--font-mono)",
                    background: active ? `color-mix(in oklch, ${tone} 14%, transparent)` : "var(--bg-inset)",
                    border: `1px solid ${active ? `color-mix(in oklch, ${tone} 40%, transparent)` : "var(--border)"}`,
                    color: active ? tone : "var(--fg-muted)",
                    borderRadius: 6, fontWeight: active ? 600 : 400,
                  }}
                >{tg}</button>
              );
            })}
          </div>
        </Field>

        <Field label="Selector">
          <input
            value={selector}
            onChange={e => setSelector(e.target.value)}
            placeholder="+model_name+"
            style={{
              width: "100%", padding: "8px 10px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)",
              borderRadius: 8, outline: 0,
              fontFamily: "var(--font-mono)", fontSize: 13,
              color: "var(--fg)",
            }}
          />
          <span style={{ fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
            dbt selector syntax — `+model+` includes upstream and downstream
          </span>
        </Field>

        <Field label="Exclude">
          <input
            value={exclude}
            onChange={e => setExclude(e.target.value)}
            placeholder="(optional)"
            style={{
              width: "100%", padding: "8px 10px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)",
              borderRadius: 8, outline: 0,
              fontFamily: "var(--font-mono)", fontSize: 13,
              color: "var(--fg)",
            }}
          />
        </Field>

        <label style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px",
          background: fullRefresh ? "color-mix(in oklch, var(--c-err) 8%, transparent)" : "var(--bg-inset)",
          border: `1px solid ${fullRefresh ? "color-mix(in oklch, var(--c-err) 28%, transparent)" : "var(--border)"}`,
          borderRadius: 8, cursor: "pointer",
        }}>
          <input
            type="checkbox"
            checked={fullRefresh}
            onChange={e => setFullRefresh(e.target.checked)}
            style={{ accentColor: "var(--c-err)" }}
          />
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 13, fontWeight: 500,
              color: fullRefresh ? "var(--c-err)" : "var(--fg)",
              fontFamily: "var(--font-mono)",
            }}>--full-refresh</div>
            <div style={{ fontSize: 11.5, color: "var(--fg-muted)", marginTop: 2 }}>
              Drops and rebuilds incremental models from scratch. Slow, expensive, occasionally necessary.
            </div>
          </div>
        </label>

        {isDangerous && (
          <div style={{
            padding: "10px 12px",
            background: "color-mix(in oklch, var(--c-err) 8%, transparent)",
            border: "1px solid color-mix(in oklch, var(--c-err) 28%, transparent)",
            borderRadius: 10,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 11.5, fontFamily: "var(--font-mono)",
              color: "var(--c-err)", marginBottom: 6,
            }}>
              <Icon.AlertTriangle size={11} />
              Type the project name to run --full-refresh on prod
            </div>
            <input
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder={intent.project}
              style={{
                width: "100%", padding: "6px 10px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border)",
                borderRadius: 6, outline: 0,
                fontFamily: "var(--font-mono)", fontSize: 12,
                color: "var(--fg)",
                caretColor: "var(--c-err)",
              }}
            />
          </div>
        )}
      </div>
    </ModalShell>
  );
}

function Field({
  label, children,
}: {
  label: string; children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{
        fontSize: 11, fontFamily: "var(--font-mono)",
        color: "var(--fg-faint)",
        letterSpacing: 0.6, textTransform: "uppercase",
      }}>{label}</span>
      <div>{children}</div>
    </div>
  );
}

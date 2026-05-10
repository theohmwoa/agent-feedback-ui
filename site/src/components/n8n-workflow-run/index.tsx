import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { N8N_DEFAULT } from "./types";
import type { N8nIntent, N8nMode, N8nPayload } from "./types";

export type { N8nIntent, N8nMode, N8nPayload, N8nNode } from "./types";
export { N8N_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.18 350)";

const MODE_LABEL: Record<N8nMode, { label: string; tone: "ok" | "warn" | "default" }> = {
  "manual":       { label: "Manual",       tone: "default" },
  "webhook-test": { label: "Webhook test", tone: "warn" },
  "production":   { label: "Production",   tone: "ok" },
};

export function N8nWorkflowRun({
  intent = N8N_DEFAULT,
  onResult,
}: {
  intent?: N8nIntent;
  onResult?: (r: ReviewResult<N8nPayload>) => void;
}) {
  const [mode, setMode] = React.useState<N8nMode>(intent.mode);
  const [inputJson, setInputJson] = React.useState(intent.inputJson);
  const [pinnedData, setPinnedData] = React.useState(!!intent.pinnedData);

  const edited =
    mode !== intent.mode ||
    inputJson !== intent.inputJson ||
    pinnedData !== !!intent.pinnedData;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      workflowId: intent.workflowId,
      mode, input: inputJson, pinnedData,
    },
    summary: `${intent.workflowName} · ${mode}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Workflow run cancelled" });

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
            fontFamily: "var(--font-mono)", fontSize: 11.5,
            color: "var(--fg-faint)",
          }}>{intent.workflowId}</span>
          {intent.isActive && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 11, color: "var(--c-ok)",
              fontFamily: "var(--font-mono)",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--c-ok)" }} />
              active
            </span>
          )}
          <div style={{ flex: 1 }} />
          {mode === "production" && <Pill tone="warn" size="sm">production</Pill>}
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
            {intent.nodes.length} nodes
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant={mode === "production" ? "primary" : "default"}
            size="sm"
            icon={<Icon.Send size={13} />}
            onClick={submit}
          >
            {edited ? "Run edited" : "Execute workflow"}
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

      {/* Title */}
      <div style={{ padding: "16px 18px 12px" }}>
        <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>
          {intent.workflowName}
        </div>
      </div>

      {/* Node diagram */}
      <div style={{
        padding: "0 18px 14px",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 0,
          padding: "12px",
          background: "var(--bg-inset)",
          border: "1px solid var(--border)", borderRadius: 10,
          overflowX: "auto",
        }}>
          {intent.nodes.map((n, i) => (
            <React.Fragment key={i}>
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                flexShrink: 0,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: `color-mix(in oklch, ${ACCENT} ${10 + i * 4}%, var(--bg-card))`,
                  border: `1px solid color-mix(in oklch, ${ACCENT} 30%, var(--border))`,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 12,
                  color: ACCENT,
                }}>{n.short}</div>
                <span style={{
                  fontSize: 10.5, color: "var(--fg-muted)",
                  fontFamily: "var(--font-mono)",
                  whiteSpace: "nowrap",
                }}>{n.name}</span>
              </div>
              {i < intent.nodes.length - 1 && (
                <div style={{
                  flex: 1,
                  height: 1,
                  margin: "0 4px",
                  marginBottom: 14,
                  background: `color-mix(in oklch, ${ACCENT} 30%, var(--border))`,
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mode picker */}
      <div style={{ padding: "0 18px 12px" }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 6,
        }}>Mode</div>
        <div style={{ display: "flex", gap: 6 }}>
          {(Object.keys(MODE_LABEL) as N8nMode[]).map(m => {
            const meta = MODE_LABEL[m];
            const active = mode === m;
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  height: 30, padding: "0 10px",
                  fontSize: 12, fontWeight: 500,
                  background: active ? "var(--bg-inset)" : "transparent",
                  color: active ? "var(--fg)" : "var(--fg-muted)",
                  border: "1px solid " + (active ? "var(--border)" : "var(--border-faint)"),
                  borderRadius: 8,
                }}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input JSON */}
      <div style={{ padding: "0 18px 12px" }}>
        <div style={{
          display: "flex", alignItems: "center",
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 6,
        }}>
          Input
          <div style={{ flex: 1 }} />
          <label style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            textTransform: "none", letterSpacing: 0,
            color: "var(--fg-muted)", cursor: "pointer",
            fontSize: 11,
          }}>
            <input
              type="checkbox"
              checked={pinnedData}
              onChange={e => setPinnedData(e.target.checked)}
              style={{ accentColor: ACCENT }}
            />
            <span>pin data</span>
          </label>
        </div>
        <textarea
          value={inputJson}
          onChange={e => setInputJson(e.target.value)}
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
    </ModalShell>
  );
}

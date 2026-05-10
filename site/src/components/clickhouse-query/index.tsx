import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { CLICKHOUSE_DEFAULT } from "./types";
import type { ClickhouseEffect, ClickhouseIntent, ClickhousePayload } from "./types";

export type { ClickhouseEffect, ClickhouseEngine, ClickhouseIntent, ClickhousePayload } from "./types";
export { CLICKHOUSE_DEFAULT } from "./types";

const ACCENT = "oklch(0.78 0.16 65)";

const EFFECT_TONE: Record<ClickhouseEffect, { fg: string; label: string; destructive?: boolean }> = {
  read:        { fg: "var(--c-ok)",   label: "READ" },
  write:       { fg: "var(--c-warn)", label: "WRITE" },
  destructive: { fg: "var(--c-err)",  label: "DESTRUCTIVE", destructive: true },
};

export function ClickhouseQuery({
  intent = CLICKHOUSE_DEFAULT,
  onResult,
}: {
  intent?: ClickhouseIntent;
  onResult?: (r: ReviewResult<ClickhousePayload>) => void;
}) {
  const [query, setQuery] = React.useState(intent.query);
  const edited = query !== intent.query;
  const t = EFFECT_TONE[intent.effect];

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { cluster: intent.cluster, database: intent.database, query },
    summary: `${intent.cluster}/${intent.database} · ${t.label}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "ClickHouse query cancelled" });

  return (
    <ModalShell
      width={700}
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
            {intent.cluster}
          </span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: "var(--fg-muted)",
          }}>
            {intent.database}
          </span>
          <div style={{ flex: 1 }} />
          {intent.isProduction && <Pill tone="warn" size="sm">production</Pill>}
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: t.fg,
            padding: "2px 8px",
            border: `1px solid color-mix(in oklch, ${t.fg} 30%, transparent)`,
            background: `color-mix(in oklch, ${t.fg} 10%, transparent)`,
            borderRadius: 6,
            fontWeight: 700,
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
          gap: 12,
        }}>
          {intent.expectedRows !== undefined && (
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
              ~{intent.expectedRows.toLocaleString()} rows
            </span>
          )}
          {intent.estimatedReadGB !== undefined && (
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
              read · ~{intent.estimatedReadGB.toFixed(1)} GB
            </span>
          )}
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant={t.destructive ? "danger" : "primary"}
            size="sm"
            icon={<Icon.Send size={13} />}
            onClick={submit}
          >
            {edited ? "Run edited" : "Run query"}
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

      {/* Engine + materialized-view hints */}
      {(intent.primaryEngine || intent.triggersMaterializedView) && (
        <div style={{
          padding: "10px 16px",
          borderBottom: "1px solid var(--border-faint)",
          display: "flex", flexWrap: "wrap", gap: 8,
        }}>
          {intent.primaryEngine && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "3px 8px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              fontFamily: "var(--font-mono)", fontSize: 11.5,
              color: "var(--fg-muted)",
            }}>
              <span style={{ color: "var(--fg-faint)" }}>engine</span>
              <span style={{ color: ACCENT, fontWeight: 600 }}>{intent.primaryEngine}</span>
            </span>
          )}
          {intent.triggersMaterializedView && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "3px 8px",
              background: "color-mix(in oklch, var(--c-warn) 12%, transparent)",
              border: "1px solid color-mix(in oklch, var(--c-warn) 28%, transparent)",
              borderRadius: 6,
              fontFamily: "var(--font-mono)", fontSize: 11.5,
              color: "var(--c-warn)",
            }}>
              <Icon.AlertTriangle size={11} />
              triggers materialized view
            </span>
          )}
        </div>
      )}

      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{
          background: "var(--code-bg)",
          border: "1px solid var(--border)",
          borderRadius: 10, overflow: "hidden",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 12px",
            borderBottom: "1px solid var(--border-faint)",
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--fg-faint)",
          }}>
            <Icon.Code size={12} />
            <span>query.sql</span>
            <div style={{ flex: 1 }} />
            <span>{query.split("\n").length} lines</span>
          </div>
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            rows={Math.max(8, Math.min(20, query.split("\n").length))}
            style={{
              width: "100%", padding: "12px 14px",
              background: "transparent", border: 0, outline: 0,
              fontFamily: "var(--font-mono)", fontSize: 13,
              color: "var(--code-fg)", lineHeight: 1.6,
              display: "block",
              caretColor: "var(--agent-ui-accent)",
            }}
          />
        </div>
      </div>
    </ModalShell>
  );
}

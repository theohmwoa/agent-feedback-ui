import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { SQL_DEFAULT } from "./types";
import type { SqlIntent, SqlPayload, SqlEffect } from "./types";

export type { SqlIntent, SqlPayload, SqlEffect } from "./types";
export { SQL_DEFAULT } from "./types";

const ACCENT = "oklch(0.74 0.10 200)";

const EFFECT_TONE: Record<SqlEffect, { fg: string; label: string }> = {
  read:        { fg: "var(--c-ok)",    label: "READ" },
  write:       { fg: "var(--c-warn)",  label: "WRITE" },
  destructive: { fg: "var(--c-err)",   label: "DESTRUCTIVE" },
};

export function SqlQueryRunner({
  intent = SQL_DEFAULT,
  onResult,
}: {
  intent?: SqlIntent;
  onResult?: (r: ReviewResult<SqlPayload>) => void;
}) {
  const [query, setQuery] = React.useState(intent.query);
  const edited = query !== intent.query;
  const t = EFFECT_TONE[intent.effect];

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { database: intent.database, query },
    summary: `${intent.database} · ${query.split("\n")[0]?.slice(0, 56)}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Query cancelled" });

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
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: "var(--fg-muted)",
            padding: "2px 8px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 6,
          }}>
            <Icon.Layers size={12} />
            {intent.database}
            {intent.schema && <span style={{ color: "var(--fg-faint)" }}>·{intent.schema}</span>}
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
          gap: 10,
        }}>
          {intent.expectedRows !== undefined && (
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
              expected · ~{intent.expectedRows.toLocaleString()} rows
            </span>
          )}
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="default" size="sm">Dry run</Button>
          <Button
            variant={intent.effect === "destructive" ? "danger" : "primary"}
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

      <div style={{ padding: "14px 16px 12px" }}>
        <div style={{
          background: "oklch(0.11 0.005 80)",
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
            rows={Math.max(6, Math.min(16, query.split("\n").length))}
            style={{
              width: "100%", padding: "12px 14px",
              background: "transparent", border: 0, outline: 0,
              fontFamily: "var(--font-mono)", fontSize: 13,
              color: "var(--fg)", lineHeight: 1.6,
              display: "block",
            }}
          />
        </div>
      </div>

      {/* Affected tables */}
      {(intent.affectedTables?.length ?? 0) > 0 && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 8,
          }}>
            Affected tables · {intent.affectedTables!.length}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {intent.affectedTables!.map(t => (
              <span key={t} style={{
                fontFamily: "var(--font-mono)", fontSize: 12,
                padding: "3px 8px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                color: "var(--fg)",
              }}>{t}</span>
            ))}
          </div>
        </div>
      )}
    </ModalShell>
  );
}

import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { POSTGRES_MIGRATION_DEFAULT } from "./types";
import type { DdlKind, PostgresMigrationIntent, PostgresMigrationPayload } from "./types";

export type { PostgresMigrationIntent, PostgresMigrationPayload, DdlKind } from "./types";
export { POSTGRES_MIGRATION_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.13 240)";

const DDL_LABEL: Record<DdlKind, { label: string; color: string }> = {
  create: { label: "CREATE", color: "var(--c-ok)" },
  alter:  { label: "ALTER",  color: "var(--c-warn)" },
  drop:   { label: "DROP",   color: "var(--c-err)" },
  rename: { label: "RENAME", color: "var(--c-warn)" },
  data:   { label: "DATA",   color: "var(--c-slack)" },
};

export function PostgresMigration({
  intent = POSTGRES_MIGRATION_DEFAULT,
  onResult,
}: {
  intent?: PostgresMigrationIntent;
  onResult?: (r: ReviewResult<PostgresMigrationPayload>) => void;
}) {
  const [sql, setSql] = React.useState(intent.sql);
  const edited = sql !== intent.sql;
  const isDestructive = !!intent.ddlSummary?.drop;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { database: intent.database, migrationFile: intent.migrationFile, sql },
    summary: `${intent.environment} · ${intent.migrationName.slice(0, 56)}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Migration cancelled" });

  const lockSeverity =
    !intent.estimatedLockMs ? null
    : intent.estimatedLockMs < 50 ? { tone: "ok" as const, label: `~${intent.estimatedLockMs}ms lock` }
    : intent.estimatedLockMs < 500 ? { tone: "warn" as const, label: `~${intent.estimatedLockMs}ms lock` }
    : { tone: "err" as const, label: `~${(intent.estimatedLockMs / 1000).toFixed(1)}s lock` };

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
            <span style={{ color: "var(--fg-faint)" }}>·{intent.environment}</span>
          </span>
          <div style={{ flex: 1 }} />
          {intent.isProduction && <Pill tone="warn" size="sm">production</Pill>}
          {isDestructive && <Pill tone="err" size="sm">destructive</Pill>}
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
          {lockSeverity && (
            <Pill tone={lockSeverity.tone} size="sm">{lockSeverity.label}</Pill>
          )}
          {intent.hasDownMigration && (
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--c-ok)" }}>
              ✓ reversible
            </span>
          )}
          {!intent.hasDownMigration && (
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--c-warn)" }}>
              ⚠ no down migration
            </span>
          )}
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="default" size="sm">Dry run</Button>
          <Button
            variant={isDestructive ? "danger" : "primary"}
            size="sm"
            icon={<Icon.Send size={13} />}
            onClick={submit}
          >
            {edited ? "Run edited" : "Run migration"}
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

      {/* DDL summary */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "12px 16px",
        borderBottom: "1px solid var(--border-faint)",
        flexWrap: "wrap",
      }}>
        <span style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase",
        }}>DDL summary</span>
        {(Object.keys(intent.ddlSummary) as DdlKind[]).map(k => {
          const n = intent.ddlSummary[k];
          if (!n) return null;
          const m = DDL_LABEL[k];
          return (
            <span
              key={k}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontFamily: "var(--font-mono)", fontSize: 11,
                color: m.color,
                padding: "2px 8px",
                border: `1px solid color-mix(in oklch, ${m.color} 30%, transparent)`,
                background: `color-mix(in oklch, ${m.color} 10%, transparent)`,
                borderRadius: 6,
                fontWeight: 700,
              }}
            >
              {m.label} <span style={{ color: "var(--fg)" }}>×{n}</span>
            </span>
          );
        })}
      </div>

      {/* SQL */}
      <div style={{ padding: "14px 16px 12px" }}>
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
            <span>{intent.migrationFile}</span>
            <div style={{ flex: 1 }} />
            <span>{sql.split("\n").length} lines</span>
          </div>
          <textarea
            value={sql}
            onChange={e => setSql(e.target.value)}
            rows={Math.max(8, Math.min(20, sql.split("\n").length))}
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

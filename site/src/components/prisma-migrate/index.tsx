import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { PRISMA_MIGRATE_DEFAULT } from "./types";
import type { PrismaMigrateIntent, PrismaMigratePayload, PrismaSchemaChange } from "./types";

export type { PrismaMigrateIntent, PrismaMigratePayload, PrismaSchemaChange } from "./types";
export { PRISMA_MIGRATE_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.13 240)";

const KIND_COLOR: Record<PrismaSchemaChange["kind"], { glyph: string; color: string }> = {
  add:    { glyph: "+", color: "var(--c-ok)" },
  remove: { glyph: "−", color: "var(--c-err)" },
  modify: { glyph: "~", color: "var(--c-warn)" },
};

export function PrismaMigrate({
  intent = PRISMA_MIGRATE_DEFAULT,
  onResult,
}: {
  intent?: PrismaMigrateIntent;
  onResult?: (r: ReviewResult<PrismaMigratePayload>) => void;
}) {
  const [reset, setReset] = React.useState(!!intent.reset);
  const [confirmText, setConfirmText] = React.useState("");
  const edited = reset !== !!intent.reset;
  const dropCount = intent.willDropTables?.length ?? 0;
  const isDestructive = reset || dropCount > 0;
  const confirmRequired = isDestructive && intent.environment === "production";
  const confirmOk = !confirmRequired || confirmText === intent.migrationName;

  const submit = () => {
    if (!confirmOk) return;
    onResult?.({
      kind: edited ? "edit" : "submit",
      payload: { environment: intent.environment, migrationName: intent.migrationName, reset },
      summary: `prisma migrate ${reset ? "reset" : "deploy"} · ${intent.migrationName}`,
    });
  };
  const cancel = () => onResult?.({ kind: "cancel", summary: "Migration cancelled" });

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
            prisma · {intent.environment}
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
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
            {intent.changes.length} change{intent.changes.length === 1 ? "" : "s"}
            {intent.affectedRowCount !== undefined && (
              <span> · ~{intent.affectedRowCount.toLocaleString()} rows</span>
            )}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant={isDestructive ? "danger" : "primary"}
            size="sm"
            disabled={!confirmOk}
            icon={<Icon.Send size={13} />}
            onClick={submit}
          >
            {reset ? "Reset DB" : edited ? "Deploy edited" : "Deploy migration"}
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

      {/* Migration name + schema path */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 16px",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <div>
          <div style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 2,
          }}>migration</div>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 13.5,
            color: "var(--fg)", fontWeight: 500,
          }}>{intent.migrationName}</div>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 11,
          color: "var(--fg-faint)",
        }}>{intent.schemaPath}</span>
      </div>

      {/* Schema diff */}
      <div style={{ padding: "14px 16px 12px" }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 8,
        }}>Schema diff</div>
        <div style={{
          background: "var(--code-bg)",
          border: "1px solid var(--border)",
          borderRadius: 10, overflow: "hidden",
        }}>
          {intent.changes.map((c, i) => {
            const m = KIND_COLOR[c.kind];
            return (
              <div
                key={i}
                style={{
                  display: "flex", gap: 10,
                  padding: "8px 12px",
                  borderBottom: i < intent.changes.length - 1
                    ? "1px solid var(--border-faint)"
                    : "none",
                  fontFamily: "var(--font-mono)", fontSize: 12.5,
                  background: `color-mix(in oklch, ${m.color} 8%, transparent)`,
                }}
              >
                <span style={{
                  width: 14, color: m.color, fontWeight: 700, textAlign: "center", flexShrink: 0,
                }}>{m.glyph}</span>
                <span style={{ color: "var(--c-slack)", minWidth: 100 }}>{c.model}</span>
                {c.field && <span style={{ color: "var(--code-fg)" }}>·{c.field}</span>}
                <span style={{ color: "var(--fg-muted)", flex: 1 }}>{c.detail}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset toggle */}
      <div style={{
        padding: "0 16px 12px",
      }}>
        <label style={{
          display: "flex", alignItems: "flex-start", gap: 10,
          padding: "10px 12px",
          background: reset ? "color-mix(in oklch, var(--c-err) 8%, transparent)" : "var(--bg-inset)",
          border: `1px solid ${reset ? "color-mix(in oklch, var(--c-err) 30%, transparent)" : "var(--border-faint)"}`,
          borderRadius: 10,
          cursor: "pointer",
        }}>
          <input
            type="checkbox"
            checked={reset}
            onChange={e => setReset(e.target.checked)}
            style={{ accentColor: "var(--c-err)", marginTop: 2 }}
          />
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 13, fontWeight: 500,
              color: reset ? "var(--c-err)" : "var(--fg)",
            }}>
              Reset database (drop and recreate)
            </div>
            <div style={{ fontSize: 12, color: "var(--fg-faint)", marginTop: 2 }}>
              Drops all tables and re-applies every migration. <strong style={{ color: reset ? "var(--c-err)" : "var(--fg-muted)" }}>This destroys all data.</strong>
            </div>
          </div>
        </label>
      </div>

      {/* Confirmation gate for destructive prod migrations */}
      {confirmRequired && (
        <div style={{
          padding: "0 16px 16px",
        }}>
          <div style={{
            padding: "10px 12px",
            background: "color-mix(in oklch, var(--c-err) 6%, transparent)",
            border: "1px solid color-mix(in oklch, var(--c-err) 30%, transparent)",
            borderRadius: 10,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, color: "var(--c-err)", fontWeight: 500, marginBottom: 6,
            }}>
              <Icon.AlertTriangle size={13} />
              Type the migration name to confirm
            </div>
            <input
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder={intent.migrationName}
              style={{
                width: "100%", padding: "8px 10px",
                background: "var(--bg-inset)",
                border: `1px solid ${confirmOk ? "color-mix(in oklch, var(--c-ok) 40%, transparent)" : "var(--border)"}`,
                borderRadius: 8, outline: 0,
                fontFamily: "var(--font-mono)", fontSize: 12.5,
                color: "var(--fg)",
              }}
            />
          </div>
        </div>
      )}
    </ModalShell>
  );
}

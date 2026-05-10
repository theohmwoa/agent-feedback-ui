import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { SNOWFLAKE_DEFAULT } from "./types";
import type { SnowflakeEffect, SnowflakeIntent, SnowflakePayload } from "./types";

export type { SnowflakeEffect, SnowflakeIntent, SnowflakePayload } from "./types";
export { SNOWFLAKE_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.13 220)";

const EFFECT_TONE: Record<SnowflakeEffect, { fg: string; label: string; destructive?: boolean }> = {
  read:        { fg: "var(--c-ok)",   label: "READ" },
  write:       { fg: "var(--c-warn)", label: "WRITE" },
  destructive: { fg: "var(--c-err)",  label: "DESTRUCTIVE", destructive: true },
};

export function SnowflakeQuery({
  intent = SNOWFLAKE_DEFAULT,
  onResult,
}: {
  intent?: SnowflakeIntent;
  onResult?: (r: ReviewResult<SnowflakePayload>) => void;
}) {
  const [query, setQuery] = React.useState(intent.query);
  const edited = query !== intent.query;
  const t = EFFECT_TONE[intent.effect];

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      warehouse: intent.warehouse,
      database: intent.database,
      schema: intent.schema,
      role: intent.role,
      query,
    },
    summary: `${intent.warehouse} · ${query.split("\n")[0]?.slice(0, 56)}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Snowflake query cancelled" });

  return (
    <ModalShell
      width={700}
      accent={ACCENT}
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)", gap: 10,
          flexWrap: "wrap",
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
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
          {intent.scanGB !== undefined && (
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
              scan · ~{intent.scanGB.toFixed(1)} GB
            </span>
          )}
          {intent.creditEstimate !== undefined && (
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
              credits · ~{intent.creditEstimate.toFixed(2)}
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
      {/* Connection chips */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 6,
        padding: "12px 16px",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <Chip icon={<Icon.Layers size={12} />} label="warehouse" value={intent.warehouse} />
        <Chip icon={<Icon.Layers size={12} />} label="database" value={intent.database} />
        <Chip icon={<Icon.Layers size={12} />} label="schema" value={intent.schema} />
        <Chip icon={<Icon.User size={12} />} label="role" value={intent.role} accent={ACCENT} />
      </div>

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

function Chip({
  icon, label, value, accent,
}: {
  icon: React.ReactNode; label: string; value: string; accent?: string;
}) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 8px",
      background: accent ? `color-mix(in oklch, ${accent} 10%, var(--bg-inset))` : "var(--bg-inset)",
      border: `1px solid ${accent ? `color-mix(in oklch, ${accent} 28%, transparent)` : "var(--border)"}`,
      borderRadius: 6,
      fontFamily: "var(--font-mono)", fontSize: 11.5,
    }}>
      <span style={{ color: accent || "var(--fg-faint)" }}>{icon}</span>
      <span style={{ color: "var(--fg-faint)" }}>{label}</span>
      <span style={{ color: accent || "var(--fg)" }}>{value}</span>
    </span>
  );
}

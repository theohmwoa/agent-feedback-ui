import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { BIGQUERY_DEFAULT } from "./types";
import type { BigqueryEffect, BigqueryIntent, BigqueryPayload } from "./types";

export type { BigqueryEffect, BigqueryIntent, BigqueryPayload } from "./types";
export { BIGQUERY_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.13 240)";

const EFFECT_TONE: Record<BigqueryEffect, { fg: string; label: string; destructive?: boolean }> = {
  read:        { fg: "var(--c-ok)",   label: "READ" },
  write:       { fg: "var(--c-warn)", label: "WRITE" },
  destructive: { fg: "var(--c-err)",  label: "DESTRUCTIVE", destructive: true },
};

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  const units = ["KB", "MB", "GB", "TB", "PB"];
  let v = n / 1024;
  for (const u of units) {
    if (v < 1024) return `${v.toFixed(v < 10 ? 2 : 1)} ${u}`;
    v /= 1024;
  }
  return `${v.toFixed(1)} EB`;
}

function estimateUsd(bytes: number): number {
  // BigQuery on-demand pricing: $5 per TB scanned (approximate).
  return (bytes / 1024 ** 4) * 5;
}

export function BigqueryQuery({
  intent = BIGQUERY_DEFAULT,
  onResult,
}: {
  intent?: BigqueryIntent;
  onResult?: (r: ReviewResult<BigqueryPayload>) => void;
}) {
  const [query, setQuery] = React.useState(intent.query);
  const [maxBytesBilledGB, setMaxBytesBilledGB] = React.useState<string>(
    intent.maxBytesBilled ? String(intent.maxBytesBilled / 1024 ** 3) : "",
  );

  const initialMaxGB = intent.maxBytesBilled ? String(intent.maxBytesBilled / 1024 ** 3) : "";
  const edited = query !== intent.query || maxBytesBilledGB !== initialMaxGB;

  const t = EFFECT_TONE[intent.effect];
  const bytes = intent.bytesBilled ?? 0;
  const cost = estimateUsd(bytes);
  const overCap = !!(intent.maxBytesBilled && bytes > intent.maxBytesBilled);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      project: intent.project,
      dataset: intent.dataset,
      query,
      maxBytesBilled: maxBytesBilledGB
        ? Math.round(parseFloat(maxBytesBilledGB) * 1024 ** 3)
        : undefined,
      destinationTable: intent.destinationTable,
    },
    summary: `${intent.project}.${intent.dataset} · ${formatBytes(bytes)} billed`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "BigQuery query cancelled" });

  return (
    <ModalShell
      width={720}
      accent={ACCENT}
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)", gap: 10,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: "var(--fg-muted)",
          }}>
            {intent.project} <span style={{ color: "var(--fg-faint)" }}>·</span> {intent.dataset}
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
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
            est · ${cost.toFixed(4)} on-demand
          </span>
          <div style={{ flex: 1 }} />
          {overCap && <Pill tone="err" size="sm">over cap</Pill>}
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant={t.destructive ? "danger" : "primary"}
            size="sm"
            disabled={overCap}
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

      {/* Big bytes-billed estimate — these queries can get expensive */}
      <div style={{
        margin: "16px",
        padding: "16px 18px",
        background: `color-mix(in oklch, ${ACCENT} 8%, transparent)`,
        border: `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)`,
        borderRadius: 12,
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 4,
          }}>Dry run · bytes billed</div>
          <div style={{
            fontSize: 28, fontWeight: 600, letterSpacing: -0.5,
            color: overCap ? "var(--c-err)" : "var(--fg)",
          }}>{formatBytes(bytes)}</div>
          <div style={{ fontSize: 11.5, color: "var(--fg-muted)", marginTop: 2 }}>
            ≈ ${cost.toFixed(4)} at $5 / TB on-demand
          </div>
        </div>
        <div style={{
          display: "flex", flexDirection: "column", gap: 4,
          minWidth: 160,
        }}>
          <span style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase",
          }}>Max bytes billed</span>
          <div style={{
            display: "flex", alignItems: "center",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 8,
          }}>
            <input
              value={maxBytesBilledGB}
              onChange={e => setMaxBytesBilledGB(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="100"
              style={{
                flex: 1, height: 30, padding: "0 10px",
                background: "transparent", border: 0, outline: 0,
                fontFamily: "var(--font-mono)", fontSize: 13,
                color: "var(--fg)",
              }}
            />
            <span style={{
              padding: "0 10px",
              fontFamily: "var(--font-mono)", fontSize: 11,
              color: "var(--fg-faint)",
            }}>GB</span>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px 12px" }}>
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

      {intent.destinationTable && (
        <div style={{
          padding: "0 16px 16px",
          fontSize: 11.5, fontFamily: "var(--font-mono)",
        }}>
          <span style={{ color: "var(--fg-faint)" }}>destination · </span>
          <span style={{ color: "var(--fg)" }}>{intent.destinationTable}</span>
        </div>
      )}
    </ModalShell>
  );
}

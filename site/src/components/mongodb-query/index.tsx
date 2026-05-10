import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { MONGO_DEFAULT } from "./types";
import type { MongoIntent, MongoOp, MongoPayload } from "./types";

export type { MongoIntent, MongoPayload, MongoOp } from "./types";
export { MONGO_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.16 145)";

const OP_TONE: Record<MongoOp, { fg: string; label: string; destructive?: boolean }> = {
  find:      { fg: "var(--c-ok)",   label: "FIND" },
  insert:    { fg: "var(--c-warn)", label: "INSERT" },
  update:    { fg: "var(--c-warn)", label: "UPDATE" },
  delete:    { fg: "var(--c-err)",  label: "DELETE", destructive: true },
  aggregate: { fg: "var(--c-linear)", label: "AGGREGATE" },
};

export function MongodbQuery({
  intent = MONGO_DEFAULT,
  onResult,
}: {
  intent?: MongoIntent;
  onResult?: (r: ReviewResult<MongoPayload>) => void;
}) {
  const [query, setQuery] = React.useState(intent.query);
  const edited = query !== intent.query;
  const t = OP_TONE[intent.op];

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      cluster: intent.cluster,
      database: intent.database,
      collection: intent.collection,
      op: intent.op,
      query,
    },
    summary: `${intent.database}.${intent.collection} · ${t.label}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "MongoDB query cancelled" });

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
            {intent.cluster}
          </span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: "var(--fg-muted)",
          }}>
            {intent.database} <span style={{ color: "var(--fg-faint)" }}>·</span> {intent.collection}
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
          {intent.expectedDocs !== undefined && (
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
              expected · ~{intent.expectedDocs.toLocaleString()} docs
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
            <span>{intent.collection}.{intent.op}.js</span>
            <div style={{ flex: 1 }} />
            <span>{query.split("\n").length} lines</span>
          </div>
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            rows={Math.max(6, Math.min(18, query.split("\n").length))}
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

      {(intent.indexesUsed?.length ?? 0) > 0 && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 8,
          }}>
            Indexes used · {intent.indexesUsed!.length}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {intent.indexesUsed!.map(ix => (
              <span key={ix} style={{
                fontFamily: "var(--font-mono)", fontSize: 12,
                padding: "3px 8px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                color: "var(--fg)",
                display: "inline-flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--c-ok)" }} />
                {ix}
              </span>
            ))}
          </div>
        </div>
      )}
    </ModalShell>
  );
}

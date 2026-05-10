import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { ES_DEFAULT } from "./types";
import type { ElasticsearchIntent, ElasticsearchPayload, EsVerb } from "./types";

export type { ElasticsearchIntent, ElasticsearchPayload, EsVerb } from "./types";
export { ES_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.16 50)";

const VERB_TONE: Record<EsVerb, { fg: string; destructive?: boolean }> = {
  GET:    { fg: "var(--c-ok)" },
  POST:   { fg: "var(--c-warn)" },
  PUT:    { fg: "var(--c-warn)" },
  DELETE: { fg: "var(--c-err)", destructive: true },
};

export function ElasticsearchQuery({
  intent = ES_DEFAULT,
  onResult,
}: {
  intent?: ElasticsearchIntent;
  onResult?: (r: ReviewResult<ElasticsearchPayload>) => void;
}) {
  const [body, setBody] = React.useState(intent.body ?? "");
  const [path, setPath] = React.useState(intent.path);
  const [explain, setExplain] = React.useState(!!intent.explain);

  const edited = body !== (intent.body ?? "")
    || path !== intent.path
    || explain !== !!intent.explain;

  const t = VERB_TONE[intent.verb];

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      cluster: intent.cluster,
      indexPattern: intent.indexPattern,
      verb: intent.verb,
      path,
      body: body || undefined,
      explain,
    },
    summary: `${intent.verb} ${path}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Elasticsearch query cancelled" });

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
            {intent.cluster.split(".")[0]}
          </span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: "var(--fg-muted)",
          }}>
            {intent.indexPattern}
          </span>
          <div style={{ flex: 1 }} />
          {intent.isProduction && <Pill tone="warn" size="sm">production</Pill>}
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
          {intent.expectedHits !== undefined && (
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
              expected · ~{intent.expectedHits.toLocaleString()} hits
            </span>
          )}
          <label style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 11.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-muted)", cursor: "pointer",
          }}>
            <input
              type="checkbox"
              checked={explain}
              onChange={e => setExplain(e.target.checked)}
              style={{ accentColor: ACCENT }}
            />
            explain
          </label>
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

      {/* Verb + path bar */}
      <div style={{ padding: "14px 16px 8px" }}>
        <div style={{
          display: "flex", alignItems: "stretch",
          background: "var(--bg-inset)",
          border: "1px solid var(--border)",
          borderRadius: 10, overflow: "hidden",
        }}>
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            padding: "0 12px",
            fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
            color: t.fg,
            borderRight: "1px solid var(--border)",
          }}>
            {intent.verb}
          </span>
          <input
            value={path}
            onChange={e => setPath(e.target.value)}
            style={{
              flex: 1, height: 34, padding: "0 10px",
              background: "transparent", border: 0, outline: 0,
              fontFamily: "var(--font-mono)", fontSize: 13,
              color: "var(--fg)",
            }}
          />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "0 16px 16px" }}>
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
            <span>body.json</span>
            <div style={{ flex: 1 }} />
            <span>{body.split("\n").length} lines</span>
          </div>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="{ }"
            rows={Math.max(8, Math.min(20, body.split("\n").length))}
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

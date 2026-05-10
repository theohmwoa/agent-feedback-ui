import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { GRAPHQL_DEFAULT } from "./types";
import type { GraphQLIntent, GraphQLOperation, GraphQLPayload, GraphQLHeader } from "./types";

export type { GraphQLIntent, GraphQLOperation, GraphQLPayload, GraphQLHeader } from "./types";
export { GRAPHQL_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.16 320)";

const OP_COLOR: Record<GraphQLOperation, string> = {
  query:        "oklch(0.74 0.13 165)",
  mutation:     "oklch(0.78 0.14 30)",
  subscription: "oklch(0.74 0.13 280)",
};

export function GraphqlQuery({
  intent = GRAPHQL_DEFAULT,
  onResult,
}: {
  intent?: GraphQLIntent;
  onResult?: (r: ReviewResult<GraphQLPayload>) => void;
}) {
  const [endpoint, setEndpoint] = React.useState(intent.endpoint);
  const [operation, setOperation] = React.useState<GraphQLOperation>(intent.operation);
  const [operationName, setOperationName] = React.useState(intent.operationName ?? "");
  const [query, setQuery] = React.useState(intent.query);
  const [variables, setVariables] = React.useState(intent.variables ?? "");
  const [headers, setHeaders] = React.useState<GraphQLHeader[]>(intent.headers ?? []);
  const [tab, setTab] = React.useState<"query" | "variables" | "headers" | "shape">("query");

  const edited =
    endpoint !== intent.endpoint ||
    operation !== intent.operation ||
    operationName !== (intent.operationName ?? "") ||
    query !== intent.query ||
    variables !== (intent.variables ?? "") ||
    JSON.stringify(headers) !== JSON.stringify(intent.headers ?? []);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      endpoint, operation,
      operationName: operationName || undefined,
      query,
      variables: variables || undefined,
      headers,
    },
    summary: `${operation.toUpperCase()} ${operationName || "anonymous"}`,
  });
  const cancel = () => onResult?.({
    kind: "cancel",
    summary: `${operation} ${operationName || "anonymous"} cancelled`,
  });

  let host = "";
  let pathname = "";
  try {
    const u = new URL(endpoint);
    host = u.host;
    pathname = u.pathname;
  } catch {
    pathname = endpoint;
  }

  const opColor = OP_COLOR[operation];

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
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: opColor,
            padding: "2px 8px",
            border: `1px solid color-mix(in oklch, ${opColor} 30%, transparent)`,
            background: `color-mix(in oklch, ${opColor} 10%, transparent)`,
            borderRadius: 6, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: 0.4,
          }}>{operation}</span>
          <div style={{ flex: 1 }} />
          {intent.affectsProduction && <Pill tone="warn" size="sm">production</Pill>}
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
            {operationName || "anonymous"}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Send edited" : "Run operation"}
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

      {/* Endpoint */}
      <div style={{ padding: "14px 16px 8px" }}>
        <div style={{
          display: "flex", alignItems: "center",
          background: "var(--bg-inset)",
          border: "1px solid var(--border)",
          borderRadius: 10, overflow: "hidden",
        }}>
          <select
            value={operation}
            onChange={e => setOperation(e.target.value as GraphQLOperation)}
            style={{
              height: 36, padding: "0 10px",
              background: "transparent",
              border: 0, outline: 0,
              fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 11.5,
              color: opColor,
              borderRight: "1px solid var(--border)",
              textTransform: "uppercase",
            }}
          >
            {(["query", "mutation", "subscription"] as GraphQLOperation[]).map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input
            value={endpoint}
            onChange={e => setEndpoint(e.target.value)}
            style={{
              flex: 1, height: 36, padding: "0 12px",
              background: "transparent",
              border: 0, outline: 0,
              fontFamily: "var(--font-mono)", fontSize: 12.5,
              color: "var(--fg)",
            }}
          />
        </div>
        {host && (
          <div style={{
            marginTop: 6,
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--fg-faint)",
          }}>
            host: <span style={{ color: "var(--fg-muted)" }}>{host}</span>
            <span style={{ marginLeft: 12 }}>path: <span style={{ color: "var(--fg-muted)" }}>{pathname}</span></span>
          </div>
        )}
      </div>

      {/* Operation name */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "8px 16px 6px",
        fontSize: 12,
      }}>
        <span style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>name</span>
        <input
          value={operationName}
          onChange={e => setOperationName(e.target.value)}
          placeholder="anonymous"
          style={{
            flex: 1, padding: "4px 8px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 6,
            outline: 0,
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: "var(--fg)",
          }}
        />
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        margin: "8px 16px 10px",
      }}>
        {[
          { id: "query",     label: "Query" },
          { id: "variables", label: `Variables` },
          { id: "headers",   label: `Headers · ${headers.length}` },
          { id: "shape",     label: "Expected" },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            style={{
              height: 26, padding: "0 10px",
              fontSize: 12, fontWeight: 500,
              color: tab === t.id ? "var(--fg)" : "var(--fg-muted)",
              background: tab === t.id ? "var(--bg-inset)" : "transparent",
              border: "1px solid " + (tab === t.id ? "var(--border)" : "transparent"),
              borderRadius: 6,
            }}
          >{t.label}</button>
        ))}
      </div>

      <div style={{ padding: "0 16px 16px" }}>
        {tab === "query" && (
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            rows={Math.max(8, Math.min(20, query.split("\n").length))}
            style={{
              width: "100%", padding: "12px 14px",
              background: "var(--code-bg)",
              border: "1px solid var(--border)",
              borderRadius: 10, outline: 0,
              fontFamily: "var(--font-mono)", fontSize: 12.5,
              color: "var(--code-fg)", lineHeight: 1.6,
              minHeight: 200, display: "block",
              caretColor: "var(--agent-ui-accent)",
            }}
          />
        )}
        {tab === "variables" && (
          <textarea
            value={variables}
            onChange={e => setVariables(e.target.value)}
            rows={8}
            placeholder="{}"
            style={{
              width: "100%", padding: "12px 14px",
              background: "var(--code-bg)",
              border: "1px solid var(--border)",
              borderRadius: 10, outline: 0,
              fontFamily: "var(--font-mono)", fontSize: 12.5,
              color: "var(--code-fg)", lineHeight: 1.6,
              minHeight: 160, display: "block",
              caretColor: "var(--agent-ui-accent)",
            }}
          />
        )}
        {tab === "headers" && (
          <div style={{
            background: "var(--bg-inset)",
            border: "1px solid var(--border)",
            borderRadius: 10, overflow: "hidden",
          }}>
            {headers.map((h, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr 24px",
                gap: 8, padding: "8px 10px",
                borderBottom: i < headers.length - 1 ? "1px solid var(--border-faint)" : "none",
                fontFamily: "var(--font-mono)", fontSize: 12,
                alignItems: "center",
              }}>
                <input
                  value={h.key}
                  onChange={e => {
                    const next = [...headers];
                    next[i] = { ...next[i]!, key: e.target.value };
                    setHeaders(next);
                  }}
                  style={{
                    background: "transparent", border: 0, outline: 0,
                    color: "var(--c-slack)",
                  }}
                />
                <input
                  value={h.value}
                  onChange={e => {
                    const next = [...headers];
                    next[i] = { ...next[i]!, value: e.target.value };
                    setHeaders(next);
                  }}
                  style={{
                    background: "transparent", border: 0, outline: 0,
                    color: "var(--fg-muted)",
                  }}
                />
                <button
                  onClick={() => setHeaders(headers.filter((_, j) => j !== i))}
                  style={{ color: "var(--fg-faint)" }}
                  aria-label="remove"
                >
                  <Icon.X size={11} />
                </button>
              </div>
            ))}
            <button
              onClick={() => setHeaders([...headers, { key: "", value: "" }])}
              style={{
                width: "100%", padding: "8px 10px",
                fontSize: 12, fontFamily: "var(--font-mono)",
                color: "var(--fg-faint)", textAlign: "left",
                background: "transparent",
              }}
            >+ add header</button>
          </div>
        )}
        {tab === "shape" && (
          <div style={{
            background: "var(--code-bg)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "12px 14px",
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: "var(--code-fg)", lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            minHeight: 160,
          }}>
            {intent.expectedShape || "// no shape declared"}
          </div>
        )}
      </div>
    </ModalShell>
  );
}

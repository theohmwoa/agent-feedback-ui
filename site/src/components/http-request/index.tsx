import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { HTTP_DEFAULT } from "./types";
import type { HttpIntent, HttpMethod, HttpPayload, HttpHeader } from "./types";

export type { HttpIntent, HttpPayload, HttpMethod, HttpHeader } from "./types";
export { HTTP_DEFAULT } from "./types";

const ACCENT = "oklch(0.74 0.10 240)";

const METHOD_COLOR: Record<HttpMethod, string> = {
  GET:    "oklch(0.74 0.13 165)",
  POST:   "oklch(0.78 0.14 95)",
  PUT:    "oklch(0.74 0.14 60)",
  PATCH:  "oklch(0.74 0.13 280)",
  DELETE: "var(--c-err)",
};

export function HttpRequest({
  intent = HTTP_DEFAULT,
  onResult,
}: {
  intent?: HttpIntent;
  onResult?: (r: ReviewResult<HttpPayload>) => void;
}) {
  const [method, setMethod] = React.useState<HttpMethod>(intent.method);
  const [url, setUrl] = React.useState(intent.url);
  const [headers, setHeaders] = React.useState<HttpHeader[]>(intent.headers ?? []);
  const [body, setBody] = React.useState(intent.body ?? "");
  const [tab, setTab] = React.useState<"headers" | "body">("body");

  const edited =
    method !== intent.method ||
    url !== intent.url ||
    JSON.stringify(headers) !== JSON.stringify(intent.headers ?? []) ||
    body !== (intent.body ?? "");

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { method, url, headers, body: body || undefined },
    summary: `${method} ${new URL(url).host}${new URL(url).pathname}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: `${method} ${url} cancelled` });

  let host = "";
  let pathname = "";
  try {
    const u = new URL(url);
    host = u.host;
    pathname = u.pathname + u.search;
  } catch {
    pathname = url;
  }

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
          <div style={{ flex: 1 }} />
          {intent.affectsProduction && (
            <Pill tone="warn" size="sm">production</Pill>
          )}
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
            expected · <span style={{ color: "var(--c-ok)" }}>{intent.expectedStatus ?? 200}</span>
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Send edited" : "Send request"}
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

      {/* URL bar */}
      <div style={{ padding: "14px 16px 10px" }}>
        <div style={{
          display: "flex", alignItems: "center",
          background: "var(--bg-inset)",
          border: "1px solid var(--border)",
          borderRadius: 10, overflow: "hidden",
        }}>
          <select
            value={method}
            onChange={e => setMethod(e.target.value as HttpMethod)}
            style={{
              height: 36, padding: "0 10px",
              background: "transparent",
              border: 0, outline: 0,
              fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12.5,
              color: METHOD_COLOR[method],
              borderRight: "1px solid var(--border)",
            }}
          >
            {(["GET", "POST", "PUT", "PATCH", "DELETE"] as HttpMethod[]).map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
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

      {/* Tabs */}
      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        margin: "8px 16px 10px",
      }}>
        {[
          { id: "body",    label: "Body" },
          { id: "headers", label: `Headers · ${headers.length}` },
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
        {tab === "body" && (
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={10}
            placeholder="// no body"
            style={{
              width: "100%", padding: "12px 14px",
              background: "oklch(0.11 0.005 80)",
              border: "1px solid var(--border)",
              borderRadius: 10, outline: 0,
              fontFamily: "var(--font-mono)", fontSize: 12.5,
              color: "var(--fg)", lineHeight: 1.6,
              minHeight: 200, display: "block",
            }}
          />
        )}
        {tab === "headers" && (
          <div style={{
            background: "var(--bg-inset)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            overflow: "hidden",
          }}>
            {headers.map((h, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "180px 1fr 24px",
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
      </div>
    </ModalShell>
  );
}

import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { WEBHOOK_DEFAULT } from "./types";
import type { WebhookIntent, WebhookMethod, WebhookPayload, WebhookHeader } from "./types";

export type { WebhookIntent, WebhookMethod, WebhookPayload, WebhookHeader } from "./types";
export { WEBHOOK_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.13 280)";

const METHOD_COLOR: Record<WebhookMethod, string> = {
  POST: "oklch(0.78 0.14 95)",
  PUT:  "oklch(0.74 0.14 60)",
};

export function WebhookFire({
  intent = WEBHOOK_DEFAULT,
  onResult,
}: {
  intent?: WebhookIntent;
  onResult?: (r: ReviewResult<WebhookPayload>) => void;
}) {
  const [url, setUrl] = React.useState(intent.url);
  const [method, setMethod] = React.useState<WebhookMethod>(intent.method);
  const [payload, setPayload] = React.useState(intent.payload);
  const [headers, setHeaders] = React.useState<WebhookHeader[]>(intent.headers ?? []);

  const edited =
    url !== intent.url ||
    method !== intent.method ||
    payload !== intent.payload ||
    JSON.stringify(headers) !== JSON.stringify(intent.headers ?? []);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { url, method, body: payload, headers },
    summary: `${method} ${(() => { try { return new URL(url).host; } catch { return url; } })()}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Webhook cancelled" });

  let host = "";
  let pathname = "";
  try {
    const u = new URL(url);
    host = u.host;
    pathname = u.pathname;
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
          {intent.retryPolicy && (
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
              ↻ {intent.retryPolicy}
            </span>
          )}
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Fire edited" : "Fire webhook"}
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

      {/* URL */}
      <div style={{ padding: "14px 16px 8px" }}>
        <div style={{
          display: "flex", alignItems: "center",
          background: "var(--bg-inset)",
          border: "1px solid var(--border)",
          borderRadius: 10, overflow: "hidden",
        }}>
          <select
            value={method}
            onChange={e => setMethod(e.target.value as WebhookMethod)}
            style={{
              height: 36, padding: "0 10px",
              background: "transparent",
              border: 0, outline: 0,
              fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12.5,
              color: METHOD_COLOR[method],
              borderRight: "1px solid var(--border)",
            }}
          >
            {(["POST", "PUT"] as WebhookMethod[]).map(m => (
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

      {/* Payload */}
      <div style={{ padding: "8px 16px 12px" }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 6,
        }}>Payload · application/json</div>
        <textarea
          value={payload}
          onChange={e => setPayload(e.target.value)}
          rows={Math.max(8, Math.min(16, payload.split("\n").length))}
          style={{
            width: "100%", padding: "12px 14px",
            background: "var(--code-bg)",
            border: "1px solid var(--border)",
            borderRadius: 10, outline: 0,
            fontFamily: "var(--font-mono)", fontSize: 12.5,
            color: "var(--code-fg)", lineHeight: 1.6,
            minHeight: 180, display: "block",
            caretColor: "var(--agent-ui-accent)",
          }}
        />
      </div>

      {/* Signature preview */}
      {intent.signatureHeader && intent.signaturePreview && (
        <div style={{ padding: "0 16px 12px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 12px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border-faint)",
            borderRadius: 8,
            fontFamily: "var(--font-mono)", fontSize: 11,
          }}>
            <Icon.Lock size={11} style={{ color: "var(--c-warn)" }} />
            <span style={{ color: "var(--c-slack)" }}>{intent.signatureHeader}</span>
            <span style={{ color: "var(--fg-faint)" }}>·</span>
            <span style={{ color: "var(--fg-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {intent.signaturePreview}
            </span>
          </div>
        </div>
      )}

      {/* Headers */}
      {(headers.length > 0) && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 6,
          }}>Headers · {headers.length}</div>
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
                  style={{ background: "transparent", border: 0, outline: 0, color: "var(--c-slack)" }}
                />
                <input
                  value={h.value}
                  onChange={e => {
                    const next = [...headers];
                    next[i] = { ...next[i]!, value: e.target.value };
                    setHeaders(next);
                  }}
                  style={{ background: "transparent", border: 0, outline: 0, color: "var(--fg-muted)" }}
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
          </div>
        </div>
      )}
    </ModalShell>
  );
}

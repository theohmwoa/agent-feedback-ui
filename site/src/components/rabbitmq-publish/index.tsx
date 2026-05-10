import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { RABBITMQ_DEFAULT } from "./types";
import type { RabbitHeader, RabbitMqIntent, RabbitMqPayload } from "./types";

export type { RabbitMqIntent, RabbitMqPayload, RabbitHeader } from "./types";
export { RABBITMQ_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.18 25)";

function fmtDuration(ms: number) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3_600_000) return `${Math.round(ms / 60_000)}m`;
  if (ms < 86_400_000) return `${(ms / 3_600_000).toFixed(1)}h`;
  return `${(ms / 86_400_000).toFixed(1)}d`;
}

export function RabbitMqPublish({
  intent = RABBITMQ_DEFAULT,
  onResult,
}: {
  intent?: RabbitMqIntent;
  onResult?: (r: ReviewResult<RabbitMqPayload>) => void;
}) {
  const [routingKey, setRoutingKey] = React.useState(intent.routingKey);
  const [body, setBody] = React.useState(intent.body);
  const [persistent, setPersistent] = React.useState(!!intent.persistent);
  const [expirationMs, setExpirationMs] = React.useState<number | undefined>(intent.expirationMs);
  const [headers, setHeaders] = React.useState<RabbitHeader[]>(intent.headers ?? []);

  const edited =
    routingKey !== intent.routingKey ||
    body !== intent.body ||
    persistent !== !!intent.persistent ||
    expirationMs !== intent.expirationMs ||
    JSON.stringify(headers) !== JSON.stringify(intent.headers ?? []);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      vhost: intent.vhost,
      exchange: intent.exchange,
      routingKey,
      body,
      persistent,
      expirationMs,
      headers,
    },
    summary: `${intent.exchange} → ${routingKey}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "RabbitMQ publish cancelled" });

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
            display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: "var(--fg-muted)",
            padding: "2px 8px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 6,
          }}>
            <Icon.Layers size={12} />
            {intent.host}
            <span style={{ color: "var(--fg-faint)" }}>·</span>
            <span style={{ color: ACCENT }}>{intent.vhost}</span>
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
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
            {persistent ? "persistent" : "transient"}
            {expirationMs !== undefined && <span> · ttl {fmtDuration(expirationMs)}</span>}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Publish edited" : "Publish"}
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

      {/* Exchange + routing key */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
        padding: "14px 16px 12px",
      }}>
        <div>
          <div style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 6,
          }}>exchange</div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 10px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 8,
            fontFamily: "var(--font-mono)", fontSize: 13,
            color: "var(--fg)",
          }}>
            <Icon.Layers size={12} style={{ color: "var(--fg-faint)" }} />
            {intent.exchange}
          </div>
        </div>
        <div>
          <div style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 6,
          }}>routing key</div>
          <input
            value={routingKey}
            onChange={e => setRoutingKey(e.target.value)}
            style={{
              width: "100%", padding: "6px 10px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)", borderRadius: 8,
              outline: 0,
              fontFamily: "var(--font-mono)", fontSize: 13,
              color: "var(--fg)",
            }}
          />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "0 16px 12px" }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 6,
        }}>message body · {body.length} bytes</div>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          rows={Math.max(6, Math.min(14, body.split("\n").length))}
          style={{
            width: "100%", padding: "12px 14px",
            background: "var(--code-bg)",
            border: "1px solid var(--border)",
            borderRadius: 10, outline: 0,
            fontFamily: "var(--font-mono)", fontSize: 12.5,
            color: "var(--code-fg)", lineHeight: 1.6,
            display: "block",
            caretColor: "var(--agent-ui-accent)",
          }}
        />
      </div>

      {/* Persistence + expiration + headers */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 200px", gap: 12,
        padding: "0 16px 16px",
      }}>
        <div>
          <div style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 6,
          }}>headers · {headers.length}</div>
          <div style={{
            background: "var(--bg-inset)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            overflow: "hidden",
          }}>
            {headers.map((h, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr 24px",
                gap: 8, padding: "6px 10px",
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
                width: "100%", padding: "6px 10px",
                fontSize: 12, fontFamily: "var(--font-mono)",
                color: "var(--fg-faint)", textAlign: "left",
                background: "transparent",
              }}
            >+ add header</button>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 10px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border-faint)", borderRadius: 8,
            fontSize: 12, color: "var(--fg)",
            cursor: "pointer",
          }}>
            <input
              type="checkbox"
              checked={persistent}
              onChange={e => setPersistent(e.target.checked)}
              style={{ accentColor: ACCENT }}
            />
            <span>persistent (delivery_mode=2)</span>
          </label>
          <div>
            <div style={{
              fontSize: 10.5, fontFamily: "var(--font-mono)",
              color: "var(--fg-faint)", letterSpacing: 0.6,
              textTransform: "uppercase", marginBottom: 6,
            }}>ttl (ms)</div>
            <input
              type="number"
              value={expirationMs ?? ""}
              onChange={e => setExpirationMs(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="∞"
              style={{
                width: "100%", padding: "6px 10px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border)", borderRadius: 8,
                outline: 0,
                fontFamily: "var(--font-mono)", fontSize: 12.5,
                color: "var(--fg)",
              }}
            />
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

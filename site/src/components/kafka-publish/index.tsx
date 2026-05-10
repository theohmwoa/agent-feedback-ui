import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { KAFKA_DEFAULT } from "./types";
import type { KafkaAck, KafkaHeader, KafkaIntent, KafkaPayload } from "./types";

export type { KafkaIntent, KafkaPayload, KafkaAck, KafkaHeader } from "./types";
export { KAFKA_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.04 80)";

const ACK_LABEL: Record<KafkaAck, string> = {
  "0":   "fire-and-forget",
  "1":   "leader ack",
  "all": "all replicas ack",
};

export function KafkaPublish({
  intent = KAFKA_DEFAULT,
  onResult,
}: {
  intent?: KafkaIntent;
  onResult?: (r: ReviewResult<KafkaPayload>) => void;
}) {
  const [partitionKey, setPartitionKey] = React.useState(intent.partitionKey ?? "");
  const [body, setBody] = React.useState(intent.body);
  const [headers, setHeaders] = React.useState<KafkaHeader[]>(intent.headers ?? []);
  const [ack, setAck] = React.useState<KafkaAck>(intent.ack);

  const edited =
    partitionKey !== (intent.partitionKey ?? "") ||
    body !== intent.body ||
    JSON.stringify(headers) !== JSON.stringify(intent.headers ?? []) ||
    ack !== intent.ack;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      cluster: intent.cluster,
      topic: intent.topic,
      partitionKey: partitionKey || undefined,
      body,
      headers,
      ack,
    },
    summary: `${intent.topic} · ${body.length} bytes`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Kafka publish cancelled" });

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
            {intent.cluster}
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
            ack=<span style={{ color: "var(--fg)" }}>{ack}</span> · {ACK_LABEL[ack]}
            {intent.batchSize && intent.batchSize > 1 && (
              <span> · batch {intent.batchSize}</span>
            )}
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
          background: `color-mix(in oklch, ${ACCENT} 10%, transparent)`,
          borderBottom: "1px solid var(--border-faint)",
          fontSize: 12.5, color: "var(--fg-muted)", lineHeight: 1.5,
        }}>
          <Icon.Sparkles size={14} style={{ color: ACCENT, marginTop: 2, flexShrink: 0 }} />
          <span>{intent.rationale}</span>
        </div>
      )}

      {/* Topic + partition key */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 220px", gap: 12,
        padding: "14px 16px 12px",
      }}>
        <div>
          <div style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 6,
          }}>topic</div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 10px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 8,
            fontFamily: "var(--font-mono)", fontSize: 13,
          }}>
            <Icon.Hash size={12} style={{ color: "var(--fg-faint)" }} />
            <span style={{ color: "var(--fg)" }}>{intent.topic}</span>
          </div>
        </div>
        <div>
          <div style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 6,
          }}>partition key</div>
          <input
            value={partitionKey}
            onChange={e => setPartitionKey(e.target.value)}
            placeholder="round-robin"
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

      {/* Headers + ack */}
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
        <div>
          <div style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 6,
          }}>ack mode</div>
          <div style={{
            display: "flex", flexDirection: "column", gap: 4,
            padding: 4,
            background: "var(--bg-inset)",
            border: "1px solid var(--border)",
            borderRadius: 10,
          }}>
            {(["0", "1", "all"] as KafkaAck[]).map(a => (
              <button
                key={a}
                onClick={() => setAck(a)}
                style={{
                  display: "flex", alignItems: "baseline", gap: 8,
                  padding: "6px 10px",
                  background: ack === a ? "var(--bg-card)" : "transparent",
                  border: ack === a ? "1px solid var(--border)" : "1px solid transparent",
                  borderRadius: 7,
                  textAlign: "left",
                  fontSize: 12,
                  color: ack === a ? "var(--fg)" : "var(--fg-muted)",
                }}
              >
                <span style={{
                  fontFamily: "var(--font-mono)", fontWeight: 700,
                  color: ack === a ? "var(--c-warn)" : "var(--fg-faint)",
                  width: 22,
                }}>{a}</span>
                <span style={{ fontSize: 11.5 }}>{ACK_LABEL[a]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

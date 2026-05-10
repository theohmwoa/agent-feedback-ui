import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { MCP_TOOL_DEFAULT } from "./types";
import type {
  McpArgField, McpConnectionStatus, McpToolIntent, McpToolPayload, McpTransport,
} from "./types";

export type {
  McpToolIntent, McpToolPayload, McpTransport, McpConnectionStatus, McpArgField,
} from "./types";
export { MCP_TOOL_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.16 50)";

const STATUS_TONE: Record<McpConnectionStatus, { fg: string; label: string }> = {
  connected:    { fg: "var(--c-ok)",   label: "connected" },
  connecting:   { fg: "var(--c-warn)", label: "connecting" },
  disconnected: { fg: "var(--fg-faint)", label: "disconnected" },
  error:        { fg: "var(--c-err)",  label: "error" },
};

const TRANSPORT_LABEL: Record<McpTransport, string> = {
  "stdio":           "stdio",
  "sse":             "sse",
  "streamable-http": "streamable-http",
};

export function McpToolCall({
  intent = MCP_TOOL_DEFAULT,
  onResult,
}: {
  intent?: McpToolIntent;
  onResult?: (r: ReviewResult<McpToolPayload>) => void;
}) {
  const [args, setArgs] = React.useState<McpArgField[]>(intent.args);

  const edited = JSON.stringify(args) !== JSON.stringify(intent.args);

  const submit = () => {
    const payload = args.reduce<Record<string, string | number | boolean>>((acc, a) => {
      acc[a.name] = a.value;
      return acc;
    }, {});
    onResult?.({
      kind: edited ? "edit" : "submit",
      payload: {
        serverName: intent.serverName,
        toolName: intent.toolName,
        args: payload,
      },
      summary: `${intent.serverName} · ${intent.toolName}`,
    });
  };
  const cancel = () => onResult?.({ kind: "cancel", summary: `${intent.toolName} cancelled` });

  const updateArg = (i: number, value: string | number | boolean) => {
    const next = [...args];
    next[i] = { ...next[i]!, value };
    setArgs(next);
  };

  const status = STATUS_TONE[intent.status];

  return (
    <ModalShell
      width={640}
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
            padding: "2px 8px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 6,
            fontFamily: "var(--font-mono)", fontSize: 11.5,
            color: "var(--fg-muted)",
          }}>
            <Icon.Terminal size={11} />
            {intent.serverName}
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: status.fg,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: 999,
              background: status.fg,
              boxShadow: intent.status === "connected"
                ? `0 0 0 4px color-mix(in oklch, ${status.fg} 20%, transparent)`
                : undefined,
            }} />
            {status.label}
          </span>
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
            transport · {TRANSPORT_LABEL[intent.transport]}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant="primary" size="sm"
            icon={<Icon.Send size={13} />}
            onClick={submit}
            disabled={intent.status !== "connected"}
          >
            {edited ? "Invoke edited" : "Invoke tool"}
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

      {/* Tool name + description */}
      <div style={{ padding: "16px 18px 8px" }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 14,
          color: "var(--fg)", fontWeight: 600,
          marginBottom: 4,
        }}>
          {intent.toolName}
        </div>
        {intent.toolDescription && (
          <div style={{
            fontSize: 12.5, color: "var(--fg-muted)",
            lineHeight: 1.5,
          }}>{intent.toolDescription}</div>
        )}
        {intent.serverUrl && (
          <div style={{
            marginTop: 8,
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--fg-faint)",
          }}>
            {intent.serverUrl}
          </div>
        )}
      </div>

      {/* Arguments */}
      <div style={{ padding: "8px 16px 12px" }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 8,
        }}>
          Arguments · {args.length}
        </div>
        <div style={{
          background: "var(--bg-inset)",
          border: "1px solid var(--border)",
          borderRadius: 10, overflow: "hidden",
        }}>
          {args.map((a, i) => (
            <div key={a.name} style={{
              padding: "10px 12px",
              borderBottom: i < args.length - 1 ? "1px solid var(--border-faint)" : "none",
              display: "flex", flexDirection: "column", gap: 4,
            }}>
              <div style={{
                display: "flex", alignItems: "baseline", gap: 8,
                fontFamily: "var(--font-mono)", fontSize: 12,
              }}>
                <span style={{ color: "var(--c-slack)" }}>{a.name}</span>
                <span style={{ color: "var(--fg-faint)", fontSize: 11 }}>{a.type}</span>
                {a.required && (
                  <span style={{
                    fontSize: 9, color: "var(--c-warn)",
                    padding: "1px 5px",
                    border: "1px solid color-mix(in oklch, var(--c-warn) 30%, transparent)",
                    background: "color-mix(in oklch, var(--c-warn) 10%, transparent)",
                    borderRadius: 4, letterSpacing: 0.5, textTransform: "uppercase",
                  }}>required</span>
                )}
              </div>
              {a.description && (
                <div style={{ fontSize: 11.5, color: "var(--fg-faint)" }}>{a.description}</div>
              )}
              <div style={{ marginTop: 4 }}>
                {a.type === "boolean" ? (
                  <label style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    fontSize: 12, color: "var(--fg)",
                  }}>
                    <input
                      type="checkbox"
                      checked={!!a.value}
                      onChange={e => updateArg(i, e.target.checked)}
                      style={{ accentColor: "var(--agent-ui-accent)" }}
                    />
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--fg-muted)" }}>
                      {a.value ? "true" : "false"}
                    </span>
                  </label>
                ) : a.type === "enum" ? (
                  <select
                    value={String(a.value)}
                    onChange={e => updateArg(i, e.target.value)}
                    style={{
                      height: 28, padding: "0 8px",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)", borderRadius: 6,
                      fontFamily: "var(--font-mono)", fontSize: 12,
                      color: "var(--fg)",
                    }}
                  >
                    {a.enumOptions?.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : a.type === "number" ? (
                  <input
                    type="number"
                    value={String(a.value)}
                    onChange={e => updateArg(i, Number(e.target.value))}
                    style={{
                      width: "100%", height: 30, padding: "0 10px",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)", borderRadius: 6,
                      fontFamily: "var(--font-mono)", fontSize: 12,
                      color: "var(--fg)", outline: 0,
                    }}
                  />
                ) : a.type === "json" ? (
                  <textarea
                    value={String(a.value)}
                    onChange={e => updateArg(i, e.target.value)}
                    rows={4}
                    style={{
                      width: "100%", padding: "8px 10px",
                      background: "var(--code-bg)",
                      border: "1px solid var(--border)", borderRadius: 6,
                      fontFamily: "var(--font-mono)", fontSize: 12,
                      color: "var(--code-fg)", outline: 0, lineHeight: 1.5,
                      caretColor: "var(--agent-ui-accent)",
                    }}
                  />
                ) : (
                  <input
                    value={String(a.value)}
                    onChange={e => updateArg(i, e.target.value)}
                    style={{
                      width: "100%", height: 30, padding: "0 10px",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)", borderRadius: 6,
                      fontFamily: "var(--font-mono)", fontSize: 12,
                      color: "var(--fg)", outline: 0,
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expected return */}
      {intent.expectedReturn && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 6,
          }}>Returns</div>
          <pre style={{
            margin: 0,
            padding: "10px 12px",
            background: "var(--code-bg)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontFamily: "var(--font-mono)", fontSize: 11.5,
            color: "var(--code-fg)", lineHeight: 1.55,
            whiteSpace: "pre-wrap",
          }}>{intent.expectedReturn}</pre>
        </div>
      )}
    </ModalShell>
  );
}

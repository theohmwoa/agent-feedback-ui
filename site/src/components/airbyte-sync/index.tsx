import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { AIRBYTE_DEFAULT } from "./types";
import type { AirbyteEndpoint, AirbyteIntent, AirbyteSyncMode, AirbyteSyncPayload } from "./types";

export type { AirbyteIntent, AirbyteSyncPayload, AirbyteEndpoint, AirbyteSyncMode, AirbyteStream } from "./types";
export { AIRBYTE_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.13 280)";

const SYNC_MODE_TONE: Record<AirbyteSyncMode, { fg: string; label: string }> = {
  full_refresh:       { fg: "var(--c-warn)", label: "FULL REFRESH" },
  incremental:        { fg: "var(--c-ok)",   label: "INCREMENTAL" },
  incremental_dedup:  { fg: "var(--c-ok)",   label: "INCREMENTAL + DEDUP" },
};

export function AirbyteSync({
  intent = AIRBYTE_DEFAULT,
  onResult,
}: {
  intent?: AirbyteIntent;
  onResult?: (r: ReviewResult<AirbyteSyncPayload>) => void;
}) {
  const [resetData, setResetData] = React.useState(intent.resetData);
  const [confirmText, setConfirmText] = React.useState("");

  const edited = resetData !== intent.resetData;
  const requiresConfirm = resetData && intent.isProduction;
  const confirmed = !requiresConfirm || confirmText === intent.connection;

  const submit = () => {
    if (!confirmed) return;
    onResult?.({
      kind: edited ? "edit" : "submit",
      payload: {
        workspace: intent.workspace,
        connection: intent.connection,
        resetData,
        streamNames: intent.streams.map(s => s.name),
      },
      summary: `${intent.connection} · ${intent.streams.length} streams${resetData ? " (reset)" : ""}`,
    });
  };
  const cancel = () => onResult?.({ kind: "cancel", summary: "Airbyte sync cancelled" });

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
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: "var(--fg-muted)",
          }}>
            {intent.workspace}
          </span>
          <div style={{ flex: 1 }} />
          {intent.isProduction && <Pill tone="warn" size="sm">production</Pill>}
          {resetData && <Pill tone="err" size="sm">reset data</Pill>}
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
            {intent.streams.length} streams
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant={resetData ? "danger" : "primary"}
            size="sm"
            disabled={!confirmed}
            icon={<Icon.Send size={13} />}
            onClick={submit}
          >
            {resetData ? "Reset and sync" : edited ? "Sync edited" : "Trigger sync"}
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

      {/* Source → destination card */}
      <div style={{
        margin: "16px",
        padding: "14px 16px",
        background: "var(--bg-inset)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Endpoint endpoint={intent.source} />
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
        }}>
          <Icon.ArrowRight size={16} style={{ color: ACCENT }} />
          <span style={{
            fontSize: 10, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)",
          }}>{intent.connection.length > 56 ? "connection" : intent.connection}</span>
        </div>
        <Endpoint endpoint={intent.destination} />
      </div>

      {/* Streams list */}
      <div style={{ padding: "0 16px 12px" }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 8,
        }}>
          Streams · {intent.streams.length}
        </div>
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 10, overflow: "hidden",
        }}>
          {intent.streams.map((s, i) => {
            const t = SYNC_MODE_TONE[s.syncMode];
            return (
              <div key={s.name} style={{
                display: "grid",
                gridTemplateColumns: "1fr 200px 100px",
                gap: 10, padding: "8px 12px",
                borderTop: i === 0 ? "none" : "1px solid var(--border-faint)",
                fontFamily: "var(--font-mono)", fontSize: 12,
                alignItems: "center",
              }}>
                <span style={{ color: "var(--fg)" }}>{s.name}</span>
                <span style={{
                  color: t.fg, fontSize: 10.5, fontWeight: 600,
                }}>{t.label}</span>
                <span style={{ color: "var(--fg-muted)", textAlign: "right" }}>
                  {s.recordCountEstimate !== undefined
                    ? `~${s.recordCountEstimate.toLocaleString()}`
                    : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset toggle */}
      <div style={{ padding: "0 16px 16px" }}>
        <label style={{
          display: "flex", alignItems: "flex-start", gap: 10,
          padding: "10px 12px",
          background: resetData ? "color-mix(in oklch, var(--c-err) 8%, transparent)" : "var(--bg-inset)",
          border: `1px solid ${resetData ? "color-mix(in oklch, var(--c-err) 28%, transparent)" : "var(--border)"}`,
          borderRadius: 8, cursor: "pointer",
        }}>
          <input
            type="checkbox"
            checked={resetData}
            onChange={e => setResetData(e.target.checked)}
            style={{ accentColor: "var(--c-err)", marginTop: 2 }}
          />
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 13, fontWeight: 500,
              color: resetData ? "var(--c-err)" : "var(--fg)",
              fontFamily: "var(--font-mono)",
            }}>Reset destination data</div>
            <div style={{ fontSize: 11.5, color: "var(--fg-muted)", marginTop: 2 }}>
              Truncates destination tables and re-syncs from scratch. Destructive — downstream materializations break until the next dbt run.
            </div>
          </div>
        </label>
      </div>

      {requiresConfirm && (
        <div style={{
          margin: "0 16px 16px",
          padding: "10px 12px",
          background: "color-mix(in oklch, var(--c-err) 8%, transparent)",
          border: "1px solid color-mix(in oklch, var(--c-err) 28%, transparent)",
          borderRadius: 10,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 11.5, fontFamily: "var(--font-mono)",
            color: "var(--c-err)", marginBottom: 6,
          }}>
            <Icon.AlertTriangle size={11} />
            Type the connection name to reset
          </div>
          <input
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            placeholder={intent.connection}
            style={{
              width: "100%", padding: "6px 10px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)",
              borderRadius: 6, outline: 0,
              fontFamily: "var(--font-mono)", fontSize: 12,
              color: "var(--fg)",
              caretColor: "var(--c-err)",
            }}
          />
        </div>
      )}
    </ModalShell>
  );
}

function Endpoint({ endpoint }: { endpoint: AirbyteEndpoint }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: `oklch(0.42 0.10 ${endpoint.hue})`,
        color: `oklch(0.96 0.04 ${endpoint.hue})`,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13,
        flexShrink: 0,
      }}>
        {endpoint.kind.slice(0, 2).toUpperCase()}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)",
        }}>{endpoint.kind}</div>
        <div style={{
          fontSize: 12.5, color: "var(--fg)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{endpoint.name}</div>
      </div>
    </div>
  );
}

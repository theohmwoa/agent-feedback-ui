import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { REDIS_DEFAULT } from "./types";
import type { RedisIntent, RedisPayload, RedisRisk } from "./types";

export type { RedisIntent, RedisPayload, RedisRisk } from "./types";
export { REDIS_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.18 25)";

const RISK_TONE: Record<RedisRisk, { fg: string; label: string; destructive?: boolean }> = {
  safe:        { fg: "var(--c-ok)",   label: "SAFE" },
  caution:     { fg: "var(--c-warn)", label: "CAUTION" },
  destructive: { fg: "var(--c-err)",  label: "DESTRUCTIVE", destructive: true },
};

// Pull the verb out of the command for display: "DEL session:* …" → "DEL"
function leadingVerb(cmd: string): string {
  const m = cmd.trim().match(/^([A-Z_]+)/i);
  return m ? m[1]!.toUpperCase() : "";
}

function isDangerVerb(verb: string): boolean {
  return /^(DEL|FLUSHDB|FLUSHALL|RENAME|UNLINK|EXPIRE|PERSIST)$/.test(verb);
}

export function RedisCommand({
  intent = REDIS_DEFAULT,
  onResult,
}: {
  intent?: RedisIntent;
  onResult?: (r: ReviewResult<RedisPayload>) => void;
}) {
  const [command, setCommand] = React.useState(intent.command);
  const edited = command !== intent.command;
  const verb = leadingVerb(command);
  const risk = intent.risk ?? (isDangerVerb(verb) ? "destructive" : "safe");
  const t = RISK_TONE[risk];

  // Destructive ops require typing the instance name to confirm.
  const requiresConfirm = risk === "destructive" && intent.isProduction;
  const [confirmText, setConfirmText] = React.useState("");
  const confirmed = !requiresConfirm || confirmText === intent.instance;

  const submit = () => {
    if (!confirmed) return;
    onResult?.({
      kind: edited ? "edit" : "submit",
      payload: { instance: intent.instance, database: intent.database, command },
      summary: `${verb || "REDIS"} → ${intent.instance}`,
    });
  };
  const cancel = () => onResult?.({ kind: "cancel", summary: "Redis command cancelled" });

  return (
    <ModalShell
      width={620}
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
            {intent.instance}
            {intent.database !== undefined && (
              <span style={{ color: "var(--fg-faint)" }}>·db{intent.database}</span>
            )}
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
          {intent.ttlSeconds !== undefined && intent.ttlSeconds > 0 && (
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
              ttl · {intent.ttlSeconds}s
            </span>
          )}
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant={t.destructive ? "danger" : "primary"}
            size="sm"
            disabled={!confirmed}
            icon={<Icon.Terminal size={13} />}
            onClick={submit}
          >
            {t.destructive ? (edited ? "Run anyway" : "Run destructive") : (edited ? "Run edited" : "Run command")}
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

      {/* Command box */}
      <div style={{ margin: "16px" }}>
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
            <span style={{ color: ACCENT }}>›</span>
            <span>redis-cli</span>
            <div style={{ flex: 1 }} />
            <span>{intent.instance.split(".")[0]}</span>
          </div>
          <div style={{
            padding: "12px 14px",
            display: "flex", gap: 8, alignItems: "flex-start",
          }}>
            {verb && (
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 13,
                color: t.fg, fontWeight: 700,
                flexShrink: 0,
              }}>{verb}</span>
            )}
            <textarea
              value={command}
              onChange={e => setCommand(e.target.value)}
              rows={Math.max(1, Math.min(4, command.split("\n").length))}
              style={{
                flex: 1, padding: 0,
                background: "transparent", border: 0, outline: 0,
                fontFamily: "var(--font-mono)", fontSize: 13,
                color: "var(--code-fg)", lineHeight: 1.5,
                display: "block",
                caretColor: "var(--agent-ui-accent)",
                resize: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Key + value preview */}
      {(intent.key || intent.valuePreview) && (
        <div style={{
          padding: "0 16px 12px",
          display: "grid",
          gridTemplateColumns: "100px 1fr",
          rowGap: 6, columnGap: 10,
          fontFamily: "var(--font-mono)", fontSize: 12,
        }}>
          {intent.key && (
            <>
              <span style={{ color: "var(--fg-faint)" }}>key</span>
              <span style={{
                color: "var(--fg)",
                background: "var(--bg-inset)",
                padding: "2px 8px", borderRadius: 4,
                wordBreak: "break-all",
              }}>{intent.key}</span>
            </>
          )}
          {intent.valuePreview && (
            <>
              <span style={{ color: "var(--fg-faint)" }}>preview</span>
              <span style={{ color: "var(--fg-muted)" }}>{intent.valuePreview}</span>
            </>
          )}
        </div>
      )}

      {/* Confirm-by-typing for destructive prod ops */}
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
            Type the instance name to confirm
          </div>
          <input
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            placeholder={intent.instance}
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
          {confirmText && !confirmed && (
            <div style={{
              marginTop: 4, fontSize: 11,
              color: "var(--fg-faint)", fontFamily: "var(--font-mono)",
            }}>doesn't match</div>
          )}
        </div>
      )}
    </ModalShell>
  );
}

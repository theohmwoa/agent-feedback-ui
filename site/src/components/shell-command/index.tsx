import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { SHELL_DEFAULT } from "./types";
import type { ShellIntent, ShellPayload, ShellRisk } from "./types";

export type { ShellIntent, ShellPayload } from "./types";
export { SHELL_DEFAULT } from "./types";

const RISK_TONE: Record<ShellRisk, { fg: string; bg: string; bd: string; label: string }> = {
  safe:    { fg: "var(--c-ok)",   bg: "color-mix(in oklch, var(--c-ok) 12%, transparent)",   bd: "color-mix(in oklch, var(--c-ok) 28%, transparent)",   label: "Safe" },
  caution: { fg: "var(--c-warn)", bg: "color-mix(in oklch, var(--c-warn) 12%, transparent)", bd: "color-mix(in oklch, var(--c-warn) 28%, transparent)", label: "Caution" },
  danger:  { fg: "var(--c-err)",  bg: "color-mix(in oklch, var(--c-err) 14%, transparent)",  bd: "color-mix(in oklch, var(--c-err) 30%, transparent)",  label: "Danger" },
};

export function ShellCommand({
  intent = SHELL_DEFAULT,
  onResult,
}: {
  intent?: ShellIntent;
  onResult?: (r: ReviewResult<ShellPayload>) => void;
}) {
  const [command, setCommand] = React.useState(intent.command);
  const edited = command !== intent.command;
  const risk = intent.risk ?? "safe";
  const r = RISK_TONE[risk];

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { command, cwd: intent.cwd ?? "~" },
    summary: `$ ${command.slice(0, 56)}${command.length > 56 ? "…" : ""}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Shell command cancelled" });

  return (
    <ModalShell
      width={620}
      accent="oklch(0.78 0.04 200)"
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)", gap: 12,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <div style={{ flex: 1 }} />
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            height: 22, padding: "0 8px",
            fontSize: 11, fontFamily: "var(--font-mono)",
            color: r.fg, background: r.bg,
            border: `1px solid ${r.bd}`, borderRadius: 999,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: r.fg }} />
            {r.label}
          </span>
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
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
            {intent.shell ?? "zsh"} · <span style={{ color: "var(--fg-muted)" }}>{intent.cwd ?? "~"}</span>
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant={risk === "danger" ? "danger" : "primary"}
            size="sm"
            icon={<Icon.Terminal size={13} />}
            onClick={submit}
          >
            {risk === "danger" ? "Run anyway" : edited ? "Run edited" : "Run command"}
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
          background: "color-mix(in oklch, oklch(0.78 0.04 200) 6%, transparent)",
          borderBottom: "1px solid var(--border-faint)",
          fontSize: 12.5, color: "var(--fg-muted)", lineHeight: 1.5,
        }}>
          <Icon.Sparkles size={14} style={{ color: "oklch(0.78 0.04 200)", marginTop: 2, flexShrink: 0 }} />
          <span>{intent.rationale}</span>
        </div>
      )}

      {/* Command box — edit-in-place */}
      <div style={{
        margin: "16px",
        background: "var(--code-bg)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        overflow: "hidden",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 12px",
          borderBottom: "1px solid var(--border-faint)",
          fontFamily: "var(--font-mono)", fontSize: 11,
          color: "var(--fg-faint)",
        }}>
          <span style={{ color: "var(--c-ok)" }}>›</span>
          <span>{intent.cwd ?? "~"}</span>
          <div style={{ flex: 1 }} />
          <span style={{ color: "var(--fg-faint)" }}>{intent.shell ?? "zsh"}</span>
        </div>
        <textarea
          value={command}
          onChange={e => setCommand(e.target.value)}
          rows={Math.max(2, Math.min(8, command.split("\n").length))}
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

      {/* Expected effect */}
      {intent.expectedEffect && (
        <div style={{ padding: "0 16px 12px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 8,
          }}>
            <Icon.AlertTriangle size={11} />
            Expected effect
          </div>
          <div style={{
            fontSize: 13, color: "var(--fg-muted)", lineHeight: 1.55,
            background: "var(--bg-inset)",
            border: "1px solid var(--border-faint)",
            borderRadius: 8, padding: "10px 12px",
          }}>
            {intent.expectedEffect}
          </div>
        </div>
      )}

      {/* Dry run — list of files / outputs */}
      {intent.dryRun && intent.dryRun.length > 0 && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 8,
          }}>
            <Icon.Diff size={11} />
            Dry run · {intent.dryRun.length} files affected
          </div>
          <div style={{
            background: "var(--bg-inset)",
            border: "1px solid var(--border-faint)",
            borderRadius: 8, padding: "8px 12px",
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: "var(--fg-muted)",
            maxHeight: 140, overflowY: "auto",
          }}>
            {intent.dryRun.map(p => (
              <div key={p} style={{ padding: "2px 0" }}>{p}</div>
            ))}
          </div>
        </div>
      )}
    </ModalShell>
  );
}

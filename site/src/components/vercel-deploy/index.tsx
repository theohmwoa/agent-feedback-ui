import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { VERCEL_DEFAULT } from "./types";
import type { VercelEnv, VercelEnvVar, VercelIntent, VercelPayload } from "./types";

export type { VercelIntent, VercelPayload, VercelEnv, VercelEnvVar } from "./types";
export { VERCEL_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.04 80)";

const TARGET_TONE: Record<VercelEnv, { label: string; color: string; bg: string }> = {
  preview:    { label: "Preview",    color: "var(--c-warn)", bg: "color-mix(in oklch, var(--c-warn) 14%, transparent)" },
  production: { label: "Production", color: "var(--c-err)",  bg: "color-mix(in oklch, var(--c-err) 14%, transparent)" },
};

const STATUS_TONE: Record<NonNullable<VercelEnvVar["status"]>, { label: string; color: string }> = {
  added:     { label: "+", color: "var(--c-ok)" },
  changed:   { label: "~", color: "var(--c-warn)" },
  unchanged: { label: "·", color: "var(--fg-faint)" },
};

export function VercelDeploy({
  intent = VERCEL_DEFAULT,
  onResult,
}: {
  intent?: VercelIntent;
  onResult?: (r: ReviewResult<VercelPayload>) => void;
}) {
  const [target, setTarget] = React.useState<VercelEnv>(intent.target);
  const [promote, setPromote] = React.useState(intent.promoteToProduction ?? false);
  const [envVars, setEnvVars] = React.useState<VercelEnvVar[]>(intent.envVars ?? []);
  const [regions, setRegions] = React.useState<string[]>(intent.regions ?? []);

  const edited =
    target !== intent.target ||
    promote !== (intent.promoteToProduction ?? false) ||
    JSON.stringify(envVars) !== JSON.stringify(intent.envVars ?? []) ||
    JSON.stringify(regions) !== JSON.stringify(intent.regions ?? []);

  const isProd = target === "production" || promote;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      project: intent.project,
      target,
      commit: intent.commit,
      envVars,
      regions,
      promoteToProduction: promote,
    },
    summary: `${intent.project} → ${target}${promote ? " · promote" : ""} · ${intent.commit}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: `Deploy ${intent.project} cancelled` });

  const t = TARGET_TONE[target];

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
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: "var(--fg-muted)",
            padding: "2px 8px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 6,
          }}>
            ▲ {intent.org}/{intent.project}
          </span>
          <div style={{ flex: 1 }} />
          {isProd && <Pill tone="warn" size="sm">production</Pill>}
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
            {intent.commit} · {regions.length} region{regions.length === 1 ? "" : "s"}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant={isProd ? "danger" : "primary"}
            size="sm"
            icon={<Icon.Send size={13} />}
            onClick={submit}
            style={isProd ? { fontWeight: 600 } : undefined}
          >
            {isProd ? "Deploy to production" : edited ? "Deploy edited" : "Deploy preview"}
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

      {/* Target chips */}
      <div style={{ padding: "14px 16px 6px" }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 8,
        }}>Target</div>
        <div style={{ display: "flex", gap: 6 }}>
          {(["preview", "production"] as VercelEnv[]).map(env => {
            const tt = TARGET_TONE[env];
            const active = target === env;
            return (
              <button
                key={env}
                onClick={() => setTarget(env)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  height: 30, padding: "0 12px",
                  fontSize: 12.5, fontWeight: 500,
                  border: `1px solid ${active ? tt.color : "var(--border)"}`,
                  background: active ? tt.bg : "transparent",
                  color: active ? tt.color : "var(--fg-muted)",
                  borderRadius: 8,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: 999, background: tt.color }} />
                {tt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Commit row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 16px",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <Icon.GitHub size={14} style={{ color: "var(--fg-faint)" }} />
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 12,
          color: "var(--fg-muted)",
        }}>{intent.branch}</span>
        <span style={{ color: "var(--fg-faint)" }}>·</span>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 12,
          color: ACCENT,
        }}>{intent.commit}</span>
        {intent.commitMessage && (
          <>
            <span style={{ color: "var(--fg-faint)" }}>·</span>
            <span style={{
              fontSize: 12.5, color: "var(--fg-muted)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              flex: 1, minWidth: 0,
            }}>{intent.commitMessage}</span>
          </>
        )}
      </div>

      {/* Env vars */}
      <div style={{ padding: "12px 16px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 8,
        }}>
          <Icon.Lock size={11} />
          Environment · {envVars.length}
        </div>
        <div style={{
          background: "var(--bg-inset)",
          border: "1px solid var(--border-faint)",
          borderRadius: 8,
          overflow: "hidden",
        }}>
          {envVars.map((v, i) => {
            const s = STATUS_TONE[v.status ?? "unchanged"];
            return (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "16px 200px 1fr 24px",
                gap: 8, padding: "6px 10px",
                borderBottom: i < envVars.length - 1 ? "1px solid var(--border-faint)" : "none",
                fontFamily: "var(--font-mono)", fontSize: 12,
                alignItems: "center",
              }}>
                <span style={{ color: s.color, fontWeight: 700, textAlign: "center" }}>{s.label}</span>
                <input
                  value={v.key}
                  onChange={e => {
                    const next = [...envVars];
                    next[i] = { ...next[i]!, key: e.target.value, status: "changed" };
                    setEnvVars(next);
                  }}
                  style={{
                    background: "transparent", border: 0, outline: 0,
                    color: "var(--c-slack)",
                  }}
                />
                <input
                  value={v.value}
                  onChange={e => {
                    const next = [...envVars];
                    next[i] = { ...next[i]!, value: e.target.value, status: "changed" };
                    setEnvVars(next);
                  }}
                  style={{
                    background: "transparent", border: 0, outline: 0,
                    color: "var(--fg-muted)",
                  }}
                />
                <button
                  onClick={() => setEnvVars(envVars.filter((_, j) => j !== i))}
                  style={{ color: "var(--fg-faint)" }}
                  aria-label="remove"
                >
                  <Icon.X size={11} />
                </button>
              </div>
            );
          })}
          <button
            onClick={() => setEnvVars([...envVars, { key: "", value: "", status: "added" }])}
            style={{
              width: "100%", padding: "6px 10px",
              fontSize: 12, fontFamily: "var(--font-mono)",
              color: "var(--fg-faint)", textAlign: "left",
              background: "transparent",
            }}
          >+ add variable</button>
        </div>
      </div>

      {/* Regions + promote */}
      <div style={{
        padding: "12px 16px",
        borderTop: "1px solid var(--border-faint)",
        display: "flex", alignItems: "center", gap: 12,
        flexWrap: "wrap",
      }}>
        <span style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase",
        }}>Regions</span>
        {regions.map(r => (
          <Pill key={r} size="xs" tone="default">
            <span style={{ fontFamily: "var(--font-mono)" }}>{r}</span>
          </Pill>
        ))}
        <div style={{ flex: 1 }} />
        {target === "preview" && (
          <label style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 12, color: "var(--fg-muted)", cursor: "pointer",
          }}>
            <input
              type="checkbox"
              checked={promote}
              onChange={e => setPromote(e.target.checked)}
              style={{ accentColor: ACCENT }}
            />
            <span>Promote to production after</span>
          </label>
        )}
      </div>
    </ModalShell>
  );
}

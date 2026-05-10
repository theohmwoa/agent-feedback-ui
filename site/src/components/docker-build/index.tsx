import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { DOCKER_DEFAULT } from "./types";
import type { DockerBuildArg, DockerIntent, DockerPayload, DockerPlatform } from "./types";

export type { DockerBuildArg, DockerIntent, DockerPayload, DockerPlatform, DockerStage } from "./types";
export { DOCKER_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.13 240)";

const ALL_PLATFORMS: DockerPlatform[] = [
  "linux/amd64", "linux/arm64", "linux/arm/v7", "darwin/amd64", "darwin/arm64",
];

export function DockerBuild({
  intent = DOCKER_DEFAULT,
  onResult,
}: {
  intent?: DockerIntent;
  onResult?: (r: ReviewResult<DockerPayload>) => void;
}) {
  const [imageTag, setImageTag] = React.useState(intent.imageTag);
  const [dockerfile, setDockerfile] = React.useState(intent.dockerfile);
  const [contextDir, setContextDir] = React.useState(intent.contextDir);
  const [buildArgs, setBuildArgs] = React.useState<DockerBuildArg[]>(intent.buildArgs);
  const [targetStage, setTargetStage] = React.useState(intent.targetStage);
  const [platforms, setPlatforms] = React.useState<DockerPlatform[]>(intent.platforms);
  const [noCache, setNoCache] = React.useState(!!intent.noCache);
  const [push, setPush] = React.useState(!!intent.push);

  const edited =
    imageTag !== intent.imageTag ||
    dockerfile !== intent.dockerfile ||
    contextDir !== intent.contextDir ||
    JSON.stringify(buildArgs) !== JSON.stringify(intent.buildArgs) ||
    targetStage !== intent.targetStage ||
    JSON.stringify(platforms) !== JSON.stringify(intent.platforms) ||
    noCache !== !!intent.noCache ||
    push !== !!intent.push;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { imageName: intent.imageName, imageTag, dockerfile, contextDir, buildArgs, targetStage, platforms, noCache, push },
    summary: `${push ? "build+push" : "build"} ${intent.imageName}:${imageTag}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Build cancelled" });

  const togglePlatform = (p: DockerPlatform) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

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
            display: "inline-flex", alignItems: "center", gap: 4,
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: "var(--fg-muted)",
            padding: "2px 8px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 6,
          }}>
            <span style={{ color: ACCENT, fontWeight: 700 }}>🐳</span>
            {intent.imageName}<span style={{ color: "var(--fg-faint)" }}>:</span>
            <span style={{ color: ACCENT }}>{imageTag}</span>
          </span>
          <div style={{ flex: 1 }} />
          {push && <Pill tone="warn" size="sm">push</Pill>}
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
            {platforms.length} platform{platforms.length === 1 ? "" : "s"}
            {targetStage && <> · target: <span style={{ color: ACCENT }}>{targetStage}</span></>}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Icon.Send size={13} />}
            onClick={submit}
            disabled={platforms.length === 0}
          >
            {edited ? "Build edited" : push ? "Build & push" : "Build"}
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

      {/* Image + tag */}
      <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
        <Field label="Image">
          <div style={{
            flex: 1, display: "flex",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)",
            borderRadius: 8, overflow: "hidden",
          }}>
            <span style={{
              padding: "0 12px", display: "inline-flex", alignItems: "center",
              fontFamily: "var(--font-mono)", fontSize: 12.5,
              color: "var(--fg-muted)",
              borderRight: "1px solid var(--border)",
            }}>{intent.imageName}:</span>
            <input
              value={imageTag}
              onChange={e => setImageTag(e.target.value)}
              style={{
                flex: 1, height: 36, padding: "0 12px",
                background: "transparent",
                border: 0, outline: 0,
                fontFamily: "var(--font-mono)", fontSize: 12.5,
                color: ACCENT,
              }}
            />
          </div>
        </Field>
        <Field label="Dockerfile">
          <input
            value={dockerfile}
            onChange={e => setDockerfile(e.target.value)}
            style={inputStyle}
          />
        </Field>
        <Field label="Context">
          <input
            value={contextDir}
            onChange={e => setContextDir(e.target.value)}
            style={inputStyle}
          />
        </Field>
      </div>

      {/* Stages */}
      {intent.stages.length > 1 && (
        <div style={{
          padding: "12px 18px",
          borderTop: "1px solid var(--border-faint)",
        }}>
          <div style={{
            fontSize: 11, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 8,
          }}>Multi-stage · target</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {intent.stages.map(s => {
              const active = targetStage === s.name;
              return (
                <button
                  key={s.name}
                  onClick={() => setTargetStage(s.name)}
                  title={s.baseImage}
                  style={{
                    display: "inline-flex", flexDirection: "column", alignItems: "flex-start",
                    padding: "6px 10px",
                    border: `1px solid ${active ? ACCENT : "var(--border)"}`,
                    background: active
                      ? `color-mix(in oklch, ${ACCENT} 14%, transparent)`
                      : "var(--bg-inset)",
                    color: active ? ACCENT : "var(--fg-muted)",
                    borderRadius: 8, cursor: "pointer", minWidth: 140,
                  }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600 }}>
                    {s.name}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--fg-faint)" }}>
                    {s.baseImage}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Build args */}
      <div style={{
        padding: "12px 18px",
        borderTop: "1px solid var(--border-faint)",
      }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 8,
        }}>Build args · {buildArgs.length}</div>
        <div style={{
          background: "var(--code-bg)",
          border: "1px solid var(--border-faint)",
          borderRadius: 8, overflow: "hidden",
        }}>
          {buildArgs.map((a, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "180px 1fr 24px",
              gap: 8, padding: "6px 10px",
              fontFamily: "var(--font-mono)", fontSize: 12,
              alignItems: "center",
              borderTop: i === 0 ? 0 : "1px solid var(--border-faint)",
            }}>
              <input
                value={a.key}
                onChange={e => {
                  const next = [...buildArgs];
                  next[i] = { ...next[i]!, key: e.target.value };
                  setBuildArgs(next);
                }}
                style={{ background: "transparent", border: 0, outline: 0, color: "var(--c-slack)" }}
              />
              <input
                value={a.value}
                onChange={e => {
                  const next = [...buildArgs];
                  next[i] = { ...next[i]!, value: e.target.value };
                  setBuildArgs(next);
                }}
                style={{ background: "transparent", border: 0, outline: 0, color: a.secret ? "var(--c-warn)" : "var(--c-mail)" }}
              />
              <button
                onClick={() => setBuildArgs(buildArgs.filter((_, j) => j !== i))}
                style={{ color: "var(--fg-faint)" }}
                aria-label="remove"
              >
                <Icon.X size={11} />
              </button>
            </div>
          ))}
          <button
            onClick={() => setBuildArgs([...buildArgs, { key: "", value: "" }])}
            style={{
              width: "100%", padding: "8px 10px",
              fontSize: 12, fontFamily: "var(--font-mono)",
              color: "var(--fg-faint)", textAlign: "left",
              background: "transparent",
            }}
          >+ add build arg</button>
        </div>
      </div>

      {/* Platforms */}
      <div style={{
        padding: "12px 18px",
        borderTop: "1px solid var(--border-faint)",
      }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 8,
        }}>Platforms</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {ALL_PLATFORMS.map(p => {
            const active = platforms.includes(p);
            return (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  height: 28, padding: "0 10px",
                  fontSize: 12, fontFamily: "var(--font-mono)",
                  border: `1px solid ${active ? ACCENT : "var(--border)"}`,
                  background: active
                    ? `color-mix(in oklch, ${ACCENT} 14%, transparent)`
                    : "var(--bg-inset)",
                  color: active ? ACCENT : "var(--fg-muted)",
                  borderRadius: 999, cursor: "pointer",
                }}
              >
                {active && <Icon.Check size={11} />}
                {p}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", flexWrap: "wrap", gap: 16,
        padding: "10px 18px 16px",
        borderTop: "1px solid var(--border-faint)",
        fontSize: 12.5,
      }}>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg-muted)", cursor: "pointer" }}>
          <input type="checkbox" checked={noCache} onChange={e => setNoCache(e.target.checked)} />
          --no-cache
        </label>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg-muted)", cursor: "pointer" }}>
          <input type="checkbox" checked={push} onChange={e => setPush(e.target.checked)} />
          Push to {intent.registry ?? "registry"}
        </label>
      </div>
    </ModalShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{
        width: 84,
        fontSize: 11, fontWeight: 500,
        textTransform: "uppercase", letterSpacing: 0.6,
        color: "var(--fg-faint)",
      }}>{label}</span>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  flex: 1, height: 36, padding: "0 12px",
  background: "var(--bg-inset)",
  border: "1px solid var(--border)",
  borderRadius: 8, outline: 0,
  fontFamily: "var(--font-mono)", fontSize: 12.5,
  color: "var(--fg)",
};

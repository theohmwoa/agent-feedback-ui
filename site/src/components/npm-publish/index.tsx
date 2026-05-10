import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { NPM_DEFAULT } from "./types";
import type { NpmIntent, NpmPayload, SemverBump } from "./types";

export type { NpmIntent, NpmPayload, SemverBump, TarballFile } from "./types";
export { NPM_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.18 25)";

function bumpVersion(current: string, bump: SemverBump): string {
  const m = /^(\d+)\.(\d+)\.(\d+)(?:-([\w.-]+))?$/.exec(current);
  if (!m) return current;
  const major = +m[1]!, minor = +m[2]!, patch = +m[3]!;
  switch (bump) {
    case "patch": return `${major}.${minor}.${patch + 1}`;
    case "minor": return `${major}.${minor + 1}.0`;
    case "major": return `${major + 1}.0.0`;
    case "prerelease": {
      const pre = m[4];
      if (pre) {
        const piece = pre.split(".");
        const last = piece[piece.length - 1];
        const n = Number(last);
        if (Number.isInteger(n)) {
          piece[piece.length - 1] = String(n + 1);
          return `${major}.${minor}.${patch}-${piece.join(".")}`;
        }
      }
      return `${major}.${minor}.${patch + 1}-rc.0`;
    }
  }
}

const BUMPS: Array<{ id: SemverBump; label: string; hint: string }> = [
  { id: "patch",      label: "patch",      hint: "x.y.Z" },
  { id: "minor",      label: "minor",      hint: "x.Y.0" },
  { id: "major",      label: "major",      hint: "X.0.0" },
  { id: "prerelease", label: "prerelease", hint: "-rc.N" },
];

const TAGS: Array<NpmIntent["tag"]> = ["latest", "beta", "next", "alpha", "canary"];

export function NpmPublish({
  intent = NPM_DEFAULT,
  onResult,
}: {
  intent?: NpmIntent;
  onResult?: (r: ReviewResult<NpmPayload>) => void;
}) {
  const [bump, setBump]   = React.useState<SemverBump>(intent.bump ?? "patch");
  const [tag, setTag]     = React.useState<string>(intent.tag ?? "latest");
  const [dryRun, setDry]  = React.useState(false);
  const [version, setVersion] = React.useState<string>(bumpVersion(intent.currentVersion, intent.bump ?? "patch"));

  React.useEffect(() => {
    setVersion(bumpVersion(intent.currentVersion, bump));
  }, [bump, intent.currentVersion]);

  const edited =
    bump !== (intent.bump ?? "patch") ||
    tag !== (intent.tag ?? "latest") ||
    dryRun ||
    version !== bumpVersion(intent.currentVersion, intent.bump ?? "patch");

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { packageName: intent.packageName, version, tag, dryRun },
    summary: `${dryRun ? "dry-run " : ""}publish ${intent.packageName}@${version} → ${tag}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Publish cancelled" });

  const fileCount = intent.files.length;

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
            display: "inline-flex", alignItems: "center", gap: 4,
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: "var(--fg-muted)",
            padding: "2px 8px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 6,
          }}>
            <span style={{ color: ACCENT, fontWeight: 700 }}>npm</span>
            {intent.packageName}
          </span>
          <div style={{ flex: 1 }} />
          <Pill tone="warn" size="sm">production</Pill>
          {intent.twoFactor && <Pill tone="ok" size="sm">2fa</Pill>}
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
            <Kbd>⌘</Kbd> <Kbd>↵</Kbd> to publish
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          {dryRun && <Pill tone="default" size="sm">dry-run</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Icon.Send size={13} />}
            onClick={submit}
          >
            {dryRun ? "Run dry-run" : edited ? "Publish edited" : "Publish"}
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

      {/* Version: current → next */}
      <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border-faint)" }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 10,
        }}>Version</div>
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 600,
        }}>
          <span style={{ color: "var(--fg-faint)" }}>{intent.currentVersion}</span>
          <Icon.ArrowRight size={16} style={{ color: "var(--fg-faint)" }} />
          <input
            value={version}
            onChange={e => setVersion(e.target.value)}
            style={{
              minWidth: 0, padding: "4px 10px",
              background: "var(--bg-inset)",
              border: `1px solid ${ACCENT}`, borderRadius: 8,
              outline: 0,
              fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 600,
              color: ACCENT,
              width: 200,
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
          {BUMPS.map(b => {
            const active = bump === b.id;
            return (
              <button
                key={b.id}
                onClick={() => setBump(b.id)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "flex-start",
                  padding: "6px 10px",
                  border: `1px solid ${active ? ACCENT : "var(--border)"}`,
                  background: active
                    ? `color-mix(in oklch, ${ACCENT} 14%, transparent)`
                    : "var(--bg-inset)",
                  color: active ? ACCENT : "var(--fg-muted)",
                  borderRadius: 8, cursor: "pointer",
                  flex: 1,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600 }}>{b.label}</span>
                <span style={{ fontSize: 10.5, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>{b.hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tag */}
      <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border-faint)" }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 8,
        }}>Dist tag</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {TAGS.map(t => {
            const active = tag === t;
            const distVer = intent.npmDistTags?.[t as "latest" | "beta" | "next"];
            return (
              <button
                key={t}
                onClick={() => setTag(t!)}
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
                {t}
                {distVer && (
                  <span style={{ color: "var(--fg-faint)" }}>· {distVer}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tarball preview */}
      <div style={{ padding: "12px 18px" }}>
        <div style={{
          display: "flex", alignItems: "center",
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 8,
        }}>
          <span>Tarball preview · {fileCount} files</span>
          <div style={{ flex: 1 }} />
          <span style={{ color: "var(--fg-muted)", textTransform: "none", letterSpacing: 0 }}>
            {intent.totalSize} packed · {intent.totalUnpacked} unpacked
          </span>
        </div>
        <div style={{
          background: "var(--bg-inset)",
          border: "1px solid var(--border-faint)",
          borderRadius: 8,
          maxHeight: 160, overflowY: "auto",
        }}>
          {intent.files.map((f, i) => (
            <div key={f.path} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "5px 12px",
              fontFamily: "var(--font-mono)", fontSize: 12,
              borderTop: i === 0 ? 0 : "1px solid var(--border-faint)",
            }}>
              <Icon.Code size={11} style={{ color: "var(--fg-faint)" }} />
              <span style={{ flex: 1, color: "var(--fg-muted)" }}>{f.path}</span>
              <span style={{ color: "var(--fg-faint)" }}>{f.size}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 18px 16px",
        fontSize: 12.5,
      }}>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg-muted)", cursor: "pointer" }}>
          <input type="checkbox" checked={dryRun} onChange={e => setDry(e.target.checked)} />
          Dry run (no actual publish)
        </label>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
          {intent.registry?.replace(/^https?:\/\//, "")}
        </span>
      </div>
    </ModalShell>
  );
}

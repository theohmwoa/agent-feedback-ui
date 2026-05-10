import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { CARGO_DEFAULT } from "./types";
import type { CargoDep, CargoIntent, CargoPayload } from "./types";

export type { CargoDep, CargoIntent, CargoPayload } from "./types";
export { CARGO_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.18 50)";

export function CargoPublish({
  intent = CARGO_DEFAULT,
  onResult,
}: {
  intent?: CargoIntent;
  onResult?: (r: ReviewResult<CargoPayload>) => void;
}) {
  const [version, setVersion] = React.useState(intent.nextVersion);
  const [yankPrevious, setYank] = React.useState(!!intent.yankPrevious);

  const edited = version !== intent.nextVersion || yankPrevious !== !!intent.yankPrevious;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { crateName: intent.crateName, version, yankPrevious },
    summary: `cargo publish ${intent.crateName}@${version}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Publish cancelled" });

  const normalDeps = intent.dependencies.filter(d => d.kind === "normal");
  const devDeps    = intent.dependencies.filter(d => d.kind === "dev");
  const buildDeps  = intent.dependencies.filter(d => d.kind === "build");

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
            <span style={{ color: ACCENT, fontWeight: 700 }}>cargo</span>
            {intent.crateName}
          </span>
          <div style={{ flex: 1 }} />
          <Pill tone="warn" size="sm">production</Pill>
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
            {intent.registry ?? "crates.io"} · {intent.bundledFiles} files · {intent.bundledSize}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          {yankPrevious && <Pill tone="err" size="sm">will yank {intent.currentVersion}</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant={yankPrevious ? "danger" : "primary"}
            size="sm"
            icon={<Icon.Send size={13} />}
            onClick={submit}
          >
            {edited ? "Publish edited" : "Publish crate"}
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {/* Manifest preview */}
        <div style={{
          padding: "16px 18px",
          borderRight: "1px solid var(--border-faint)",
        }}>
          <div style={{
            fontSize: 11, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 10,
          }}>Manifest · Cargo.toml</div>

          <div style={{
            background: "var(--code-bg)",
            border: "1px solid var(--border-faint)",
            borderRadius: 8,
            padding: "12px 14px",
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: "var(--code-fg)", lineHeight: 1.7,
          }}>
            <Field k="name" v={`"${intent.crateName}"`} />
            <Field k="version" v={
              <input
                value={version}
                onChange={e => setVersion(e.target.value)}
                style={{
                  padding: "0 6px",
                  background: "color-mix(in oklch, var(--code-fg) 6%, transparent)",
                  border: `1px solid ${ACCENT}`, borderRadius: 4,
                  outline: 0,
                  fontFamily: "var(--font-mono)", fontSize: 12,
                  color: ACCENT, width: 120,
                }}
              />
            } />
            {intent.manifest.license      && <Field k="license"     v={`"${intent.manifest.license}"`} />}
            {intent.manifest.description  && <Field k="description" v={`"${intent.manifest.description.slice(0, 64)}…"`} truncate />}
            {intent.manifest.repository   && <Field k="repository"  v={`"${intent.manifest.repository}"`} truncate />}
            {intent.manifest.homepage     && <Field k="homepage"    v={`"${intent.manifest.homepage}"`} truncate />}
            {intent.manifest.rustVersion  && <Field k="rust-version" v={`"${intent.manifest.rustVersion}"`} />}
            {intent.manifest.keywords && intent.manifest.keywords.length > 0 && (
              <Field k="keywords" v={`[${intent.manifest.keywords.map(s => `"${s}"`).join(", ")}]`} truncate />
            )}
            {intent.manifest.categories && intent.manifest.categories.length > 0 && (
              <Field k="categories" v={`[${intent.manifest.categories.map(s => `"${s}"`).join(", ")}]`} truncate />
            )}
          </div>

          <div style={{
            marginTop: 10,
            display: "flex", alignItems: "center", gap: 14,
            fontFamily: "var(--font-mono)", fontSize: 11.5,
            color: "var(--fg-muted)",
          }}>
            <span>
              <span style={{ color: "var(--fg-faint)" }}>was </span>
              {intent.currentVersion}
            </span>
            <Icon.ArrowRight size={11} style={{ color: "var(--fg-faint)" }} />
            <span style={{ color: ACCENT, fontWeight: 600 }}>{version}</span>
          </div>
        </div>

        {/* Dependency tree */}
        <div style={{
          padding: "16px 18px",
        }}>
          <div style={{
            fontSize: 11, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 10,
          }}>Dependencies · {intent.dependencies.length}</div>

          <DepGroup label="dependencies"     deps={normalDeps} />
          {devDeps.length > 0   && <DepGroup label="dev-dependencies"   deps={devDeps} />}
          {buildDeps.length > 0 && <DepGroup label="build-dependencies" deps={buildDeps} />}
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 18px 16px",
        borderTop: "1px solid var(--border-faint)",
        fontSize: 12.5,
      }}>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg-muted)", cursor: "pointer" }}>
          <input type="checkbox" checked={yankPrevious} onChange={e => setYank(e.target.checked)} />
          Yank {intent.currentVersion} after publish
        </label>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
          you can yank later if you change your mind
        </span>
      </div>
    </ModalShell>
  );
}

function Field({ k, v, truncate }: { k: string; v: React.ReactNode; truncate?: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      whiteSpace: truncate ? "nowrap" : "normal",
      overflow: truncate ? "hidden" : "visible",
      textOverflow: truncate ? "ellipsis" : "clip",
    }}>
      <span style={{ color: "var(--c-slack)" }}>{k}</span>
      <span style={{ color: "var(--fg-dim)" }}>=</span>
      <span style={{ color: typeof v === "string" ? "var(--c-mail)" : "var(--code-fg)", flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{v}</span>
    </div>
  );
}

function DepGroup({ label, deps }: { label: string; deps: CargoDep[] }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: 11,
        color: "var(--fg-faint)", marginBottom: 4,
      }}>[{label}]</div>
      {deps.map(d => (
        <div key={d.name + d.kind} style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "2px 0",
          fontFamily: "var(--font-mono)", fontSize: 12,
        }}>
          <span style={{ color: "var(--c-slack)" }}>{d.name}</span>
          <span style={{ color: "var(--fg-dim)" }}>=</span>
          <span style={{ color: "var(--c-mail)" }}>"{d.version}"</span>
        </div>
      ))}
    </div>
  );
}

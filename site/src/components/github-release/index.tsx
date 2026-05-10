import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { RELEASE_DEFAULT } from "./types";
import type { ReleaseAsset, ReleaseIntent, ReleasePayload } from "./types";

export type { ReleaseAsset, ReleaseIntent, ReleasePayload } from "./types";
export { RELEASE_DEFAULT } from "./types";

const ACCENT = "oklch(0.78 0.06 280)";

export function GithubRelease({
  intent = RELEASE_DEFAULT,
  onResult,
}: {
  intent?: ReleaseIntent;
  onResult?: (r: ReviewResult<ReleasePayload>) => void;
}) {
  const [tag, setTag]               = React.useState(intent.suggestedTag);
  const [title, setTitle]           = React.useState(intent.title);
  const [notes, setNotes]           = React.useState(intent.notes);
  const [prerelease, setPrerelease] = React.useState(!!intent.prerelease);
  const [latest, setLatest]         = React.useState(intent.latest !== false);
  const [draft, setDraft]           = React.useState(!!intent.draft);

  const edited =
    tag !== intent.suggestedTag ||
    title !== intent.title ||
    notes !== intent.notes ||
    prerelease !== !!intent.prerelease ||
    latest !== (intent.latest !== false) ||
    draft !== !!intent.draft;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { repo: intent.repo, tag, title, notes, prerelease, latest, draft },
    summary: `${draft ? "draft" : "release"} ${tag} · ${title.slice(0, 36)}…`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Release cancelled" });

  // Quick semver bump suggestions
  const tagSuggestions = React.useMemo(() => {
    const m = /^v?(\d+)\.(\d+)\.(\d+)/.exec(intent.previousTag);
    if (!m) return [intent.suggestedTag];
    const major = +m[1]!, minor = +m[2]!, patch = +m[3]!;
    return [
      `v${major}.${minor}.${patch + 1}`,
      `v${major}.${minor + 1}.0`,
      `v${major + 1}.0.0`,
    ];
  }, [intent.previousTag]);

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
            <Icon.GitHub size={12} />
            {intent.repo}
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
            {intent.previousTag} → <span style={{ color: ACCENT }}>{tag}</span>
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          {prerelease && <Pill tone="warn" size="sm">pre-release</Pill>}
          {draft && <Pill tone="default" size="sm">draft</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Icon.Tag size={13} />}
            onClick={submit}
          >
            {draft ? "Save draft" : edited ? "Cut edited release" : "Cut release"}
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

      <div style={{
        padding: "14px 18px 10px",
        display: "flex", flexDirection: "column", gap: 8,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase",
        }}>
          <Icon.Tag size={11} />
          Tag
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--bg-inset)",
          border: "1px solid var(--border)",
          borderRadius: 8, padding: "0 12px",
        }}>
          <input
            value={tag}
            onChange={e => setTag(e.target.value)}
            placeholder="vX.Y.Z"
            style={{
              flex: 1, height: 36,
              background: "transparent",
              border: 0, outline: 0,
              fontFamily: "var(--font-mono)", fontSize: 13.5,
              color: "var(--fg)",
            }}
          />
          {intent.targetCommitish && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
              from {intent.targetCommitish}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {tagSuggestions.map((s, i) => {
            const labels = ["patch", "minor", "major"];
            return (
              <button
                key={s}
                onClick={() => setTag(s)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontFamily: "var(--font-mono)", fontSize: 11,
                  padding: "3px 8px",
                  background: tag === s ? `color-mix(in oklch, ${ACCENT} 18%, transparent)` : "var(--bg-inset)",
                  border: `1px solid ${tag === s ? ACCENT : "var(--border)"}`,
                  borderRadius: 999,
                  color: tag === s ? ACCENT : "var(--fg-muted)",
                  cursor: "pointer",
                }}
              >
                <span style={{ color: "var(--fg-faint)" }}>{labels[i]}</span>
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "8px 18px" }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 6,
        }}>Title</div>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{
            width: "100%", padding: "10px 12px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)",
            borderRadius: 8, outline: 0,
            fontSize: 14, fontWeight: 500,
            color: "var(--fg)",
          }}
        />
      </div>

      <div style={{ padding: "12px 18px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 6,
        }}>
          <span>Release notes</span>
          <span style={{ flex: 1 }} />
          <span style={{ color: "var(--c-ok)", textTransform: "none", letterSpacing: 0 }}>
            ✓ auto-generated from commits since {intent.previousTag}
          </span>
        </div>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={9}
          style={{
            width: "100%", padding: "12px 14px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)",
            borderRadius: 10, outline: 0,
            fontFamily: "var(--font-mono)", fontSize: 12.5,
            color: "var(--fg)", lineHeight: 1.65,
            minHeight: 200, display: "block",
          }}
        />
      </div>

      {/* Assets */}
      {intent.assets && intent.assets.length > 0 && (
        <div style={{ padding: "0 18px 12px" }}>
          <div style={{
            fontSize: 11, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 6,
          }}>Attached assets · {intent.assets.length}</div>
          <div style={{
            background: "var(--bg-inset)",
            border: "1px solid var(--border-faint)",
            borderRadius: 8,
            overflow: "hidden",
          }}>
            {intent.assets.map((a, i) => (
              <div key={a.name} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 12px",
                fontFamily: "var(--font-mono)", fontSize: 12,
                borderTop: i === 0 ? 0 : "1px solid var(--border-faint)",
              }}>
                <Icon.Paperclip size={11} style={{ color: "var(--fg-faint)" }} />
                <span style={{ flex: 1, color: "var(--fg)" }}>{a.name}</span>
                <span style={{ color: "var(--fg-faint)" }}>{a.size}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toggles */}
      <div style={{
        display: "flex", alignItems: "center", flexWrap: "wrap", gap: 16,
        padding: "10px 18px 16px",
        fontSize: 12.5,
      }}>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg-muted)", cursor: "pointer" }}>
          <input type="checkbox" checked={prerelease} onChange={e => setPrerelease(e.target.checked)} />
          Pre-release
        </label>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg-muted)", cursor: "pointer" }}>
          <input type="checkbox" checked={latest} onChange={e => setLatest(e.target.checked)} />
          Mark as latest
        </label>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg-muted)", cursor: "pointer" }}>
          <input type="checkbox" checked={draft} onChange={e => setDraft(e.target.checked)} />
          Save as draft
        </label>
      </div>
    </ModalShell>
  );
}

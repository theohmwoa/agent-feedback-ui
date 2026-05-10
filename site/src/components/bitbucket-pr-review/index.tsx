import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { BITBUCKET_PR_DEFAULT } from "./types";
import type { BbBuild, BbPrIntent, BbPrPayload, BbReviewKind } from "./types";

export type { BbBuild, BbPrIntent, BbPrPayload, BbReviewKind } from "./types";
export { BITBUCKET_PR_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.13 240)";

const KIND_META: Record<BbReviewKind, { label: string; icon: React.ReactNode; color: string }> = {
  approve:    { label: "Approve",    icon: <Icon.Check size={13} />,         color: "var(--c-ok)" },
  needs_work: { label: "Needs work", icon: <Icon.AlertTriangle size={13} />, color: "var(--c-err)" },
  comment:    { label: "Comment",    icon: <Icon.Edit size={13} />,          color: "var(--fg-muted)" },
};

const BUILD_META: Record<BbBuild["status"], { color: string; glyph: string; label: string }> = {
  successful:  { color: "var(--c-ok)",   glyph: "●", label: "successful" },
  failed:      { color: "var(--c-err)",  glyph: "●", label: "failed" },
  in_progress: { color: "var(--c-warn)", glyph: "◐", label: "in progress" },
  stopped:     { color: "var(--fg-faint)", glyph: "○", label: "stopped" },
};

export function BitbucketPrReview({
  intent = BITBUCKET_PR_DEFAULT,
  onResult,
}: {
  intent?: BbPrIntent;
  onResult?: (r: ReviewResult<BbPrPayload>) => void;
}) {
  const [kind, setKind] = React.useState<BbReviewKind>(intent.draftReviewKind ?? "comment");
  const [body, setBody] = React.useState(intent.draftBody ?? "");
  const edited = kind !== (intent.draftReviewKind ?? "comment") || body !== (intent.draftBody ?? "");

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { workspace: intent.workspace, repo: intent.repo, number: intent.number, kind, body },
    summary: `${KIND_META[kind].label} · ${intent.repo}#${intent.number}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "PR review dismissed" });

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
            <span style={{ color: ACCENT, fontWeight: 700 }}>bb</span>
            <span>{intent.workspace}/{intent.repo}</span>
            <span style={{ color: "var(--fg-faint)" }}>·</span>
            <span style={{ color: ACCENT }}>#{intent.number}</span>
          </span>
          <div style={{ flex: 1 }} />
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
            review <span style={{ color: KIND_META[kind].color }}>{KIND_META[kind].label.toLowerCase()}</span>
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant={kind === "needs_work" ? "danger" : "primary"}
            size="sm"
            icon={KIND_META[kind].icon}
            onClick={submit}
          >
            {edited ? `Submit edited ${KIND_META[kind].label.toLowerCase()}` : `Submit ${KIND_META[kind].label.toLowerCase()}`}
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

      <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border-faint)" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 11.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          marginBottom: 6,
        }}>
          <Avatar name={intent.author} size={16} />
          <span style={{ color: "var(--fg-muted)" }}>{intent.author}</span>
          <span style={{
            padding: "1px 6px", background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 4,
            color: ACCENT, marginLeft: 8,
          }}>{intent.sourceBranch}</span>
          <span style={{ color: ACCENT, fontWeight: 700 }}>⟶</span>
          <span style={{
            padding: "1px 6px", background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 4,
            color: "var(--fg)",
          }}>{intent.destinationBranch}</span>
        </div>
        <h3 style={{
          margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: -0.3,
          color: "var(--fg)",
        }}>{intent.title}</h3>
        <div style={{
          marginTop: 10,
          display: "flex", alignItems: "center", gap: 14,
          fontFamily: "var(--font-mono)", fontSize: 12,
        }}>
          <span style={{ color: "var(--fg-muted)" }}>
            {intent.filesChanged} file{intent.filesChanged === 1 ? "" : "s"}
          </span>
          <span style={{ color: "var(--c-ok)" }}>+{intent.added}</span>
          <span style={{ color: "var(--c-err)" }}>−{intent.deleted}</span>
        </div>
      </div>

      <div style={{
        padding: "12px 18px",
        borderBottom: "1px solid var(--border-faint)",
        fontSize: 13, lineHeight: 1.55,
        color: "var(--fg-muted)",
        whiteSpace: "pre-wrap",
      }}>
        {intent.description}
      </div>

      {/* Build status row */}
      <div style={{
        padding: "12px 18px",
        borderBottom: "1px solid var(--border-faint)",
        display: "flex", flexDirection: "column", gap: 4,
      }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 4,
        }}>Builds</div>
        {intent.builds.map(b => {
          const m = BUILD_META[b.status];
          return (
            <div key={b.name} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "6px 10px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border-faint)",
              borderRadius: 6,
              fontSize: 12.5,
            }}>
              <span style={{ color: m.color, fontSize: 14, width: 10, textAlign: "center" }}>{m.glyph}</span>
              <span style={{ flex: 1, color: "var(--fg)" }}>{b.name}</span>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                color: m.color, textTransform: "lowercase",
              }}>{m.label}</span>
            </div>
          );
        })}
        {intent.reviewers && intent.reviewers.length > 0 && (
          <div style={{
            marginTop: 6, display: "flex", alignItems: "center", gap: 6,
            fontSize: 11, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)",
          }}>
            <Icon.Users size={11} />
            <span>reviewers:</span>
            {intent.reviewers.map(r => (
              <span key={r} style={{ color: "var(--fg-muted)" }}>{r}</span>
            ))}
          </div>
        )}
      </div>

      {/* Review draft */}
      <div style={{ padding: "14px 18px 18px" }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 10,
        }}>Your review</div>

        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          {(["approve", "needs_work", "comment"] as BbReviewKind[]).map(k => {
            const m = KIND_META[k];
            const active = kind === k;
            return (
              <button
                key={k}
                onClick={() => setKind(k)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  height: 28, padding: "0 10px",
                  fontSize: 12.5, fontWeight: 500,
                  border: `1px solid ${active ? m.color : "var(--border)"}`,
                  background: active
                    ? `color-mix(in oklch, ${m.color} 14%, transparent)`
                    : "transparent",
                  color: active ? m.color : "var(--fg-muted)",
                  borderRadius: 8, cursor: "pointer",
                }}
              >
                {m.icon}
                {m.label}
              </button>
            );
          })}
        </div>

        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Leave a comment…"
          rows={5}
          style={{
            width: "100%", padding: "10px 12px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 10,
            outline: 0,
            fontSize: 13, lineHeight: 1.55,
            color: "var(--fg)",
            fontFamily: "var(--font-sans)",
          }}
        />
      </div>
    </ModalShell>
  );
}

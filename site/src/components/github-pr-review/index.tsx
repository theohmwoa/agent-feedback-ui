import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { PR_DEFAULT } from "./types";
import type { PrCheck, PrIntent, PrReviewKind, PrReviewPayload } from "./types";

export type { PrIntent, PrReviewPayload, PrReviewKind, PrCheck } from "./types";
export { PR_DEFAULT } from "./types";

const ACCENT = "oklch(0.78 0.06 280)";

const KIND_META: Record<PrReviewKind, { label: string; icon: React.ReactNode; color: string }> = {
  approve:         { label: "Approve",         icon: <Icon.Check size={13} />, color: "var(--c-ok)" },
  comment:         { label: "Comment",         icon: <Icon.Edit size={13} />,  color: "var(--fg-muted)" },
  request_changes: { label: "Request changes", icon: <Icon.AlertTriangle size={13} />, color: "var(--c-err)" },
};

const CHECK_META: Record<PrCheck["status"], { color: string; glyph: string }> = {
  ok:      { color: "var(--c-ok)",   glyph: "✓" },
  fail:    { color: "var(--c-err)",  glyph: "✗" },
  pending: { color: "var(--c-warn)", glyph: "·" },
};

export function GithubPrReview({
  intent = PR_DEFAULT,
  onResult,
}: {
  intent?: PrIntent;
  onResult?: (r: ReviewResult<PrReviewPayload>) => void;
}) {
  const [kind, setKind] = React.useState<PrReviewKind>(intent.draftReviewKind ?? "comment");
  const [body, setBody] = React.useState(intent.draftBody ?? "");

  const edited = kind !== (intent.draftReviewKind ?? "comment") || body !== (intent.draftBody ?? "");

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { repo: intent.repo, number: intent.number, kind, body },
    summary: `${KIND_META[kind].label} · #${intent.number} ${intent.title.slice(0, 40)}…`,
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
            <Icon.GitHub size={12} />
            {intent.repo}<span style={{ color: "var(--fg-faint)" }}>·</span>
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
            variant={kind === "request_changes" ? "danger" : "primary"}
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

      {/* PR header */}
      <div style={{
        padding: "16px 18px",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          fontSize: 11.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          marginBottom: 6,
        }}>
          <Avatar name={intent.author} size={16} />
          <span style={{ color: "var(--fg-muted)" }}>{intent.author}</span>
          <span>wants to merge</span>
          <span style={{
            padding: "1px 6px", background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 4,
            color: "var(--c-linear)",
          }}>{intent.branch}</span>
          <span>→</span>
          <span style={{
            padding: "1px 6px", background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 4,
            color: "var(--fg)",
          }}>{intent.baseBranch}</span>
        </div>
        <h3 style={{
          margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: -0.3,
          color: "var(--fg)",
        }}>
          {intent.title}
        </h3>

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

      {/* Summary */}
      <div style={{
        padding: "12px 18px",
        borderBottom: "1px solid var(--border-faint)",
        fontSize: 13, lineHeight: 1.55,
        color: "var(--fg-muted)",
        whiteSpace: "pre-wrap",
      }}>
        {intent.summary}
      </div>

      {/* Checks */}
      <div style={{
        padding: "12px 18px",
        borderBottom: "1px solid var(--border-faint)",
        display: "flex", flexWrap: "wrap", gap: 6,
      }}>
        {intent.checks.map(c => {
          const m = CHECK_META[c.status];
          return (
            <span
              key={c.name}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "3px 8px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border)", borderRadius: 999,
                fontFamily: "var(--font-mono)", fontSize: 11.5,
                color: "var(--fg-muted)",
              }}
            >
              <span style={{
                color: m.color, fontWeight: 700, fontSize: 13,
                display: "inline-block", width: 10, textAlign: "center",
              }}>{m.glyph}</span>
              {c.name}
            </span>
          );
        })}
      </div>

      {/* Review draft */}
      <div style={{ padding: "14px 18px 18px" }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 10,
        }}>Your review</div>

        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          {(["approve", "comment", "request_changes"] as PrReviewKind[]).map(k => {
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
                  borderRadius: 8,
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

import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { COMMIT_DEFAULT } from "./types";
import type { CommitFile, CommitIntent, CommitPayload, CommitType } from "./types";

export type { CommitFile, CommitIntent, CommitPayload, CommitType } from "./types";
export { COMMIT_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.04 60)";

const TYPES: Array<{ id: CommitType; color: string; hint: string }> = [
  { id: "feat",     color: "var(--c-ok)",     hint: "new feature" },
  { id: "fix",      color: "var(--c-err)",    hint: "bug fix" },
  { id: "docs",     color: "var(--fg-muted)", hint: "docs only" },
  { id: "refactor", color: "var(--c-linear)", hint: "no behavior change" },
  { id: "perf",     color: "var(--c-warn)",   hint: "performance" },
  { id: "test",     color: "var(--c-slack)",  hint: "tests only" },
  { id: "chore",    color: "var(--fg-faint)", hint: "tooling/deps" },
  { id: "build",    color: "var(--fg-faint)", hint: "build system" },
  { id: "ci",       color: "var(--fg-faint)", hint: "CI config" },
  { id: "style",    color: "var(--fg-faint)", hint: "formatting" },
  { id: "revert",   color: "var(--c-err)",    hint: "revert prior commit" },
];

const STATUS_GLYPH: Record<CommitFile["status"], { glyph: string; color: string }> = {
  modified: { glyph: "M", color: "var(--c-warn)" },
  added:    { glyph: "A", color: "var(--c-ok)" },
  deleted:  { glyph: "D", color: "var(--c-err)" },
  renamed:  { glyph: "R", color: "var(--c-linear)" },
};

export function GitCommitMessage({
  intent = COMMIT_DEFAULT,
  onResult,
}: {
  intent?: CommitIntent;
  onResult?: (r: ReviewResult<CommitPayload>) => void;
}) {
  const [type, setType]       = React.useState<CommitType>(intent.type);
  const [scope, setScope]     = React.useState(intent.scope ?? "");
  const [subject, setSubject] = React.useState(intent.subject);
  const [body, setBody]       = React.useState(intent.body ?? "");
  const [amend, setAmend]     = React.useState(!!intent.amend);
  const [signoff, setSignoff] = React.useState(!!intent.signoff);

  const edited =
    type    !== intent.type ||
    scope   !== (intent.scope ?? "") ||
    subject !== intent.subject ||
    body    !== (intent.body ?? "") ||
    amend   !== !!intent.amend ||
    signoff !== !!intent.signoff;

  const fullSubject = `${type}${scope ? `(${scope})` : ""}: ${subject}`;
  const fullMessage = body ? `${fullSubject}\n\n${body}` : fullSubject;
  const subjectLen = fullSubject.length;
  const subjectOver = subjectLen > 72;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      message: signoff
        ? `${fullMessage}\n\nSigned-off-by: ${intent.authorName} <${intent.authorEmail}>`
        : fullMessage,
      amend, signoff,
    },
    summary: `${amend ? "amend" : "commit"} · ${fullSubject.slice(0, 56)}${fullSubject.length > 56 ? "…" : ""}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Commit cancelled" });

  const totalAdded   = intent.files.reduce((a, f) => a + f.added, 0);
  const totalDeleted = intent.files.reduce((a, f) => a + f.deleted, 0);

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
            <Icon.Code size={12} />
            {intent.branch}
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
            <Kbd>⌘</Kbd> <Kbd>↵</Kbd> to commit
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          {amend && <Pill tone="warn" size="sm">amend</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Icon.Check size={13} />}
            onClick={submit}
            disabled={subject.trim().length === 0}
          >
            {amend ? "Amend commit" : edited ? "Commit edited" : "Commit"}
          </Button>
        </div>
      }
    >
      {intent.rationale && (
        <div style={{
          display: "flex", gap: 10,
          padding: "12px 16px",
          background: `color-mix(in oklch, ${ACCENT} 12%, transparent)`,
          borderBottom: "1px solid var(--border-faint)",
          fontSize: 12.5, color: "var(--fg-muted)", lineHeight: 1.5,
        }}>
          <Icon.Sparkles size={14} style={{ color: ACCENT, marginTop: 2, flexShrink: 0 }} />
          <span>{intent.rationale}</span>
        </div>
      )}

      <div style={{
        padding: "12px 18px",
        borderBottom: "1px solid var(--border-faint)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <Avatar name={intent.authorName} size={20} />
        <span style={{ fontSize: 12.5, color: "var(--fg)" }}>{intent.authorName}</span>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 11.5,
          color: "var(--fg-faint)",
        }}>{intent.authorEmail}</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--fg-muted)" }}>
          {intent.files.length} file{intent.files.length === 1 ? "" : "s"}
          {" "}<span style={{ color: "var(--c-ok)" }}>+{totalAdded}</span>
          {" "}<span style={{ color: "var(--c-err)" }}>−{totalDeleted}</span>
        </span>
      </div>

      {/* Files list */}
      <div style={{
        padding: "10px 12px",
        borderBottom: "1px solid var(--border-faint)",
        maxHeight: 140, overflowY: "auto",
      }}>
        {intent.files.map(f => {
          const m = STATUS_GLYPH[f.status];
          return (
            <div key={f.path} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "3px 8px",
              fontFamily: "var(--font-mono)", fontSize: 12,
            }}>
              <span style={{
                color: m.color, fontWeight: 700,
                width: 14, textAlign: "center",
              }}>{m.glyph}</span>
              <span style={{ flex: 1, color: "var(--fg-muted)" }}>{f.path}</span>
              <span style={{ color: "var(--c-ok)", minWidth: 36, textAlign: "right" }}>+{f.added}</span>
              <span style={{ color: "var(--c-err)", minWidth: 36, textAlign: "right" }}>−{f.deleted}</span>
            </div>
          );
        })}
      </div>

      {/* Type picker */}
      <div style={{ padding: "12px 18px 0" }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 8,
        }}>Type</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
          {TYPES.map(t => {
            const active = t.id === type;
            return (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                title={t.hint}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  height: 24, padding: "0 8px",
                  fontSize: 11.5, fontFamily: "var(--font-mono)",
                  border: `1px solid ${active ? t.color : "var(--border)"}`,
                  background: active
                    ? `color-mix(in oklch, ${t.color} 14%, transparent)`
                    : "var(--bg-inset)",
                  color: active ? t.color : "var(--fg-muted)",
                  borderRadius: 6, cursor: "pointer",
                }}
              >{t.id}</button>
            );
          })}
        </div>
      </div>

      {/* Subject + body */}
      <div style={{ padding: "0 18px 12px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--bg-inset)",
          border: `1px solid ${subjectOver ? "color-mix(in oklch, var(--c-warn) 40%, transparent)" : "var(--border)"}`,
          borderRadius: 8, padding: "0 10px",
          marginBottom: 8,
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 12.5,
            color: TYPES.find(t => t.id === type)?.color ?? "var(--fg-muted)",
            fontWeight: 600,
          }}>{type}{scope ? "" : ":"}</span>
          {(scope || true) && (
            <>
              <span style={{ color: "var(--fg-faint)" }}>(</span>
              <input
                value={scope}
                onChange={e => setScope(e.target.value)}
                placeholder="scope"
                style={{
                  width: 80, height: 32,
                  background: "transparent",
                  border: 0, outline: 0,
                  fontFamily: "var(--font-mono)", fontSize: 12.5,
                  color: "var(--c-linear)",
                }}
              />
              <span style={{ color: "var(--fg-faint)" }}>):</span>
            </>
          )}
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="short, imperative summary"
            style={{
              flex: 1, height: 32,
              background: "transparent",
              border: 0, outline: 0,
              fontSize: 13, color: "var(--fg)",
            }}
          />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: subjectOver ? "var(--c-warn)" : "var(--fg-faint)",
          }}>{subjectLen}/72</span>
        </div>

        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Body — explain why, not what"
          rows={5}
          style={{
            width: "100%", padding: "10px 12px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 8,
            outline: 0,
            fontSize: 13, lineHeight: 1.55,
            color: "var(--fg)",
            fontFamily: "var(--font-mono)",
          }}
        />
      </div>

      {/* Toggles */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "10px 18px 16px",
        fontSize: 12.5,
      }}>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg-muted)", cursor: "pointer" }}>
          <input type="checkbox" checked={amend} onChange={e => setAmend(e.target.checked)} />
          Amend last
        </label>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg-muted)", cursor: "pointer" }}>
          <input type="checkbox" checked={signoff} onChange={e => setSignoff(e.target.checked)} />
          Sign off
        </label>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
          conventional commits v1.0
        </span>
      </div>
    </ModalShell>
  );
}

import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { GITHUB_ISSUE_DEFAULT } from "./types";
import type { GhLabel, GithubIssueIntent, GithubIssuePayload } from "./types";

export type { GithubIssueIntent, GithubIssuePayload, GhLabel } from "./types";
export { GITHUB_ISSUE_DEFAULT } from "./types";

const ACCENT = "oklch(0.78 0.04 280)";

export function GithubIssue({
  intent = GITHUB_ISSUE_DEFAULT,
  onResult,
}: {
  intent?: GithubIssueIntent;
  onResult?: (r: ReviewResult<GithubIssuePayload>) => void;
}) {
  const [title, setTitle] = React.useState(intent.title);
  const [body, setBody] = React.useState(intent.body);
  const [labels, setLabels] = React.useState<GhLabel[]>(intent.labels);
  const [assignees, setAssignees] = React.useState<string[]>(intent.assignees);

  const edited =
    title !== intent.title ||
    body !== intent.body ||
    JSON.stringify(labels) !== JSON.stringify(intent.labels) ||
    JSON.stringify(assignees) !== JSON.stringify(intent.assignees);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      repo: intent.repo,
      title, body,
      labels: labels.map(l => l.name),
      assignees,
      milestone: intent.milestone,
    },
    summary: `${intent.repo} · ${title.slice(0, 56)}${title.length > 56 ? "…" : ""}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Issue cancelled" });

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
            display: "inline-flex", alignItems: "center", gap: 6,
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
          {intent.template && (
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
              template: {intent.template}
            </span>
          )}
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
            <Kbd>⌘</Kbd> <Kbd>↵</Kbd> to submit
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Discard</Button>
          <Button variant="primary" size="sm" icon={<Icon.Plus size={13} />} onClick={submit}>
            {edited ? "Submit edited issue" : "Submit new issue"}
          </Button>
        </div>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px" }}>
        {/* Main column */}
        <div style={{
          padding: "16px 18px",
          borderRight: "1px solid var(--border-faint)",
        }}>
          {intent.rationale && (
            <div style={{
              display: "flex", gap: 8,
              padding: "10px 12px",
              background: `color-mix(in oklch, ${ACCENT} 8%, transparent)`,
              border: `1px solid color-mix(in oklch, ${ACCENT} 28%, transparent)`,
              borderRadius: 8,
              fontSize: 12.5, color: "var(--fg-muted)",
              marginBottom: 14, lineHeight: 1.5,
            }}>
              <Icon.Sparkles size={13} style={{ color: ACCENT, marginTop: 2, flexShrink: 0 }} />
              <span>{intent.rationale}</span>
            </div>
          )}

          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Issue title"
            style={{
              width: "100%", marginBottom: 8,
              padding: "10px 12px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 15, fontWeight: 500,
              color: "var(--fg)", outline: 0,
            }}
          />

          <div style={{
            border: "1px solid var(--border)", borderRadius: 8,
            background: "var(--bg-inset)", overflow: "hidden",
          }}>
            <div style={{
              display: "flex", padding: "6px 10px",
              borderBottom: "1px solid var(--border-faint)",
              fontSize: 11, fontFamily: "var(--font-mono)",
              color: "var(--fg-faint)", gap: 14,
            }}>
              <span style={{ color: "var(--fg)" }}>Write</span>
              <span>Preview</span>
              <div style={{ flex: 1 }} />
              <span>markdown supported</span>
            </div>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={14}
              placeholder="Describe the issue…"
              style={{
                width: "100%", padding: "12px 14px",
                background: "transparent",
                border: 0, outline: 0,
                fontFamily: "var(--font-mono)", fontSize: 12.5,
                color: "var(--fg-muted)", lineHeight: 1.65,
                minHeight: 220, display: "block",
              }}
            />
          </div>
        </div>

        {/* Side panel */}
        <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 16 }}>
          <SidePanel label="Assignees" icon={<Icon.User size={13} />}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {assignees.map(a => (
                <div key={a} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 12.5,
                }}>
                  <Avatar name={a} size={20} />
                  <span style={{ color: "var(--fg)" }}>{a}</span>
                  <div style={{ flex: 1 }} />
                  <button
                    onClick={() => setAssignees(assignees.filter(x => x !== a))}
                    style={{ color: "var(--fg-faint)", padding: 0 }}
                    aria-label={`remove ${a}`}
                  >
                    <Icon.X size={11} />
                  </button>
                </div>
              ))}
              <button
                style={{
                  fontSize: 12, color: "var(--fg-faint)",
                  textAlign: "left", padding: "2px 0",
                }}
              >+ add assignee</button>
            </div>
          </SidePanel>

          <SidePanel label="Labels" icon={<Icon.Tag size={13} />}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {labels.map(l => (
                <span
                  key={l.name}
                  onClick={() => setLabels(labels.filter(x => x.name !== l.name))}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    fontSize: 11, padding: "2px 8px",
                    background: `color-mix(in oklch, ${l.color} 14%, var(--bg-inset))`,
                    border: `1px solid color-mix(in oklch, ${l.color} 30%, transparent)`,
                    borderRadius: 999,
                    color: l.color, cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: l.color }} />
                  {l.name}
                </span>
              ))}
            </div>
          </SidePanel>

          {intent.milestone && (
            <SidePanel label="Milestone" icon={<Icon.Flag size={13} />}>
              <div style={{
                fontSize: 12.5, color: "var(--fg-muted)",
                padding: "4px 8px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                display: "inline-block",
              }}>
                {intent.milestone}
              </div>
            </SidePanel>
          )}

          <div style={{ flex: 1 }} />

          <div style={{
            fontSize: 11, color: "var(--fg-faint)",
            fontFamily: "var(--font-mono)",
            borderTop: "1px solid var(--border-faint)",
            paddingTop: 12,
          }}>
            new issue · this is a public action
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

function SidePanel({ label, icon, children }: {
  label: string; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        fontSize: 10.5, color: "var(--fg-faint)",
        textTransform: "uppercase", letterSpacing: 0.6,
        fontWeight: 500, marginBottom: 8,
      }}>
        {icon}
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, Dot, Kbd, ModalShell, Pill, hashHue,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { JIRA_ISSUE_DEFAULT } from "./types";
import type { JiraIssueIntent, JiraIssuePayload, JiraIssueType, JiraPriority } from "./types";

export type { JiraIssueIntent, JiraIssuePayload, JiraIssueType, JiraPriority } from "./types";
export { JIRA_ISSUE_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.10 240)";

const ISSUE_TYPES: Array<{ id: JiraIssueType; color: string; glyph: string }> = [
  { id: "Story", color: "oklch(0.66 0.16 145)", glyph: "▢" },
  { id: "Bug",   color: "oklch(0.62 0.20 25)",  glyph: "●" },
  { id: "Task",  color: "oklch(0.62 0.10 240)", glyph: "✓" },
  { id: "Epic",  color: "oklch(0.60 0.20 290)", glyph: "⚡" },
];

const PRIORITIES: Array<{ id: JiraPriority; color: string; glyph: string }> = [
  { id: "Highest", color: "var(--c-err)",          glyph: "⏶⏶" },
  { id: "High",    color: "oklch(0.66 0.18 35)",   glyph: "⏶" },
  { id: "Medium",  color: "oklch(0.74 0.15 60)",   glyph: "⎯" },
  { id: "Low",     color: "oklch(0.62 0.10 220)",  glyph: "⏷" },
  { id: "Lowest",  color: "var(--fg-faint)",       glyph: "⏷⏷" },
];

export function JiraIssue({
  intent = JIRA_ISSUE_DEFAULT,
  onResult,
}: {
  intent?: JiraIssueIntent;
  onResult?: (r: ReviewResult<JiraIssuePayload>) => void;
}) {
  const [issueType, setIssueType] = React.useState<JiraIssueType>(intent.issueType);
  const [title, setTitle] = React.useState(intent.title);
  const [description, setDescription] = React.useState(intent.description);
  const [priority, setPriority] = React.useState<JiraPriority>(intent.priority);
  const [labels, setLabels] = React.useState<string[]>(intent.labels);
  const [storyPoints, setStoryPoints] = React.useState<number | undefined>(intent.storyPoints);
  const [edited, setEdited] = React.useState(false);

  React.useEffect(() => {
    setEdited(
      issueType !== intent.issueType ||
      title !== intent.title ||
      description !== intent.description ||
      priority !== intent.priority ||
      JSON.stringify(labels) !== JSON.stringify(intent.labels) ||
      storyPoints !== intent.storyPoints
    );
  }, [issueType, title, description, priority, labels, storyPoints, intent]);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      projectKey: intent.project.key,
      issueType, title, description, priority, labels,
      sprint: intent.sprint,
      storyPoints,
      assignee: intent.assignee.name,
    },
    summary: `${intent.project.key} · ${title.slice(0, 56)}${title.length > 56 ? "…" : ""}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Jira issue cancelled" });

  const curType = ISSUE_TYPES.find(t => t.id === issueType)!;
  const curPriority = PRIORITIES.find(p => p.id === priority)!;

  return (
    <ModalShell
      width={780}
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
            fontFamily: "var(--font-mono)", fontSize: 11.5,
            color: ACCENT,
            padding: "3px 8px",
            border: `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)`,
            background: `color-mix(in oklch, ${ACCENT} 10%, transparent)`,
            borderRadius: 6,
          }}>
            <Icon.Layers size={11} />
            {intent.project.key}
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
            new {issueType.toLowerCase()} · {intent.project.name}
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
            <Kbd>⌘</Kbd> <Kbd>↵</Kbd> to submit · <Kbd>esc</Kbd> to cancel
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Discard</Button>
          <Button variant="primary" size="sm" icon={<Icon.Plus size={13} />} onClick={submit}>
            {edited ? "Create edited" : "Create"}
          </Button>
        </div>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", minHeight: 420 }}>
        {/* Main column */}
        <div style={{
          padding: "16px 18px",
          borderRight: "1px solid var(--border-faint)",
        }}>
          {/* Issue type chip selector */}
          <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
            {ISSUE_TYPES.map(t => {
              const active = t.id === issueType;
              return (
                <button
                  key={t.id}
                  onClick={() => setIssueType(t.id)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    height: 26, padding: "0 10px",
                    fontSize: 12, fontWeight: 500,
                    background: active ? `color-mix(in oklch, ${t.color} 16%, transparent)` : "var(--bg-inset)",
                    color: active ? t.color : "var(--fg-muted)",
                    border: `1px solid ${active ? `color-mix(in oklch, ${t.color} 40%, transparent)` : "var(--border)"}`,
                    borderRadius: 6, cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <span style={{ color: t.color, fontWeight: 700 }}>{t.glyph}</span>
                  {t.id}
                </button>
              );
            })}
          </div>

          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Summary"
            style={{
              width: "100%",
              background: "transparent",
              border: 0, outline: 0,
              fontSize: 18, fontWeight: 600, letterSpacing: -0.2,
              color: "var(--fg)", padding: "4px 0", marginBottom: 8,
            }}
          />

          {intent.rationale && (
            <div style={{
              display: "flex", gap: 8,
              padding: "10px 12px",
              background: `color-mix(in oklch, ${ACCENT} 6%, transparent)`,
              border: `1px solid color-mix(in oklch, ${ACCENT} 22%, transparent)`,
              borderRadius: 8,
              fontSize: 12.5, color: "var(--fg-muted)",
              margin: "8px 0 14px", lineHeight: 1.5,
            }}>
              <Icon.Sparkles size={13} style={{ color: ACCENT, marginTop: 2, flexShrink: 0 }} />
              <span>{intent.rationale}</span>
            </div>
          )}

          {/* Description toolbar (rich-text affordance) */}
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "4px 0",
            borderBottom: "1px solid var(--border-faint)",
            marginBottom: 6,
          }}>
            <ToolBtn icon={<Icon.Bold size={12} />} />
            <ToolBtn icon={<Icon.Italic size={12} />} />
            <ToolBtn icon={<Icon.Link size={12} />} />
            <span style={{ width: 1, height: 12, background: "var(--border)" }} />
            <ToolBtn icon={<Icon.List size={12} />} />
            <ToolBtn icon={<Icon.Code size={12} />} />
            <span style={{ width: 1, height: 12, background: "var(--border)" }} />
            <ToolBtn icon={<Icon.AtSign size={12} />} />
            <ToolBtn icon={<Icon.Paperclip size={12} />} />
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 10.5, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
              wiki markup
            </span>
          </div>

          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={12}
            placeholder="Describe the issue…"
            style={{
              width: "100%",
              background: "transparent",
              border: 0, outline: 0,
              fontSize: 13, fontFamily: "var(--font-mono)",
              color: "var(--fg-muted)", lineHeight: 1.6,
              padding: "4px 0", minHeight: 220,
            }}
          />
        </div>

        {/* Side panel */}
        <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 14 }}>
          <SidePanelRow icon={<Icon.AlertTriangle size={13} />} label="Priority">
            <PrioritySelect value={priority} onChange={setPriority} cur={curPriority} />
          </SidePanelRow>

          <SidePanelRow icon={<Icon.User size={13} />} label="Assignee">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Avatar name={intent.assignee.name} size={20} />
              <span style={{ fontSize: 12.5 }}>{intent.assignee.name}</span>
            </div>
          </SidePanelRow>

          <SidePanelRow icon={<Icon.Bot size={13} />} label="Reporter">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Avatar name={intent.reporter.name} size={20} />
              <span style={{ fontSize: 12.5 }}>{intent.reporter.name}</span>
            </div>
          </SidePanelRow>

          {intent.sprint && (
            <SidePanelRow icon={<Icon.Calendar size={13} />} label="Sprint">
              <span style={{
                fontSize: 11.5, color: "var(--fg-muted)",
                padding: "3px 8px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                display: "inline-block",
              }}>
                {intent.sprint}
              </span>
            </SidePanelRow>
          )}

          <SidePanelRow icon={<Icon.Flag size={13} />} label="Story points">
            <div style={{ display: "inline-flex", gap: 4 }}>
              {[1, 2, 3, 5, 8, 13].map(n => (
                <button
                  key={n}
                  onClick={() => setStoryPoints(n === storyPoints ? undefined : n)}
                  style={{
                    width: 22, height: 22, borderRadius: 4,
                    fontSize: 11, fontFamily: "var(--font-mono)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    background: n === storyPoints ? "var(--fg)" : "var(--bg-inset)",
                    color: n === storyPoints ? "var(--bg)" : "var(--fg-faint)",
                    border: `1px solid ${n === storyPoints ? "var(--fg)" : "var(--border)"}`,
                    cursor: "pointer",
                  }}
                >{n}</button>
              ))}
            </div>
          </SidePanelRow>

          <SidePanelRow icon={<Icon.Tag size={13} />} label="Labels">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {labels.map(l => (
                <button
                  key={l}
                  onClick={() => setLabels(labels.filter(x => x !== l))}
                  style={{
                    fontSize: 11, padding: "2px 8px",
                    background: "var(--bg-inset)",
                    border: "1px solid var(--border)", borderRadius: 999,
                    color: "var(--fg-muted)", fontFamily: "var(--font-mono)",
                    display: "inline-flex", alignItems: "center", gap: 4,
                    cursor: "pointer",
                  }}
                >
                  <Dot color={`oklch(0.62 0.13 ${hashHue(l)})`} />
                  {l}
                </button>
              ))}
              <button style={{
                fontSize: 11, width: 22, height: 22,
                background: "transparent",
                border: "1px dashed var(--border-strong)",
                borderRadius: 999, color: "var(--fg-faint)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}>
                <Icon.Plus size={11} />
              </button>
            </div>
          </SidePanelRow>

          {(intent.components?.length ?? 0) > 0 && (
            <SidePanelRow icon={<Icon.Layers size={13} />} label="Components">
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {intent.components!.map(c => (
                  <span key={c} style={{ fontSize: 11.5, color: ACCENT, fontFamily: "var(--font-mono)" }}>
                    {c}
                  </span>
                ))}
              </div>
            </SidePanelRow>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

function ToolBtn({ icon }: { icon: React.ReactNode }) {
  return (
    <button style={{
      width: 22, height: 22,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      borderRadius: 4, color: "var(--fg-faint)",
      cursor: "pointer", background: "transparent",
    }}>
      {icon}
    </button>
  );
}

function SidePanelRow({ icon, label, children }: {
  icon: React.ReactNode; label: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        fontSize: 10.5, color: "var(--fg-faint)",
        textTransform: "uppercase", letterSpacing: 0.6,
        fontWeight: 500, marginBottom: 6,
      }}>
        {icon}
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

function PrioritySelect({
  value, onChange, cur,
}: {
  value: JiraPriority;
  onChange: (p: JiraPriority) => void;
  cur: { id: JiraPriority; color: string; glyph: string };
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          height: 26, padding: "0 8px",
          background: "var(--bg-inset)",
          border: "1px solid var(--border)", borderRadius: 6,
          fontSize: 12.5, color: "var(--fg)",
          cursor: "pointer",
        }}
      >
        <span style={{ color: cur.color, fontWeight: 700, width: 16, textAlign: "center" }}>
          {cur.glyph}
        </span>
        <span>{cur.id}</span>
        <Icon.ChevronDown size={12} style={{ color: "var(--fg-faint)" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0,
          minWidth: 160, background: "var(--bg-card)",
          border: "1px solid var(--border)", borderRadius: 8,
          padding: 4, zIndex: 10,
          boxShadow: "0 12px 30px -8px rgb(0 0 0 / .55)",
        }}>
          {PRIORITIES.map(p => (
            <button
              key={p.id}
              onClick={() => { onChange(p.id); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                width: "100%", padding: "6px 8px",
                fontSize: 12.5, color: "var(--fg)",
                background: p.id === value ? "var(--bg-inset)" : "transparent",
                borderRadius: 6, textAlign: "left", cursor: "pointer",
              }}
            >
              <span style={{ color: p.color, fontWeight: 700, width: 20, textAlign: "center" }}>{p.glyph}</span>
              {p.id}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { CLICKUP_TASK_DEFAULT } from "./types";
import type { ClickUpPriority, ClickUpTaskIntent, ClickUpTaskPayload } from "./types";

export type { ClickUpPriority, ClickUpStatus, ClickUpTaskIntent, ClickUpTaskPayload } from "./types";
export { CLICKUP_TASK_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.16 290)";

const PRIORITIES: Array<{ id: ClickUpPriority; color: string }> = [
  { id: "Urgent", color: "var(--c-err)" },
  { id: "High",   color: "oklch(0.74 0.15 60)" },
  { id: "Normal", color: "oklch(0.62 0.10 240)" },
  { id: "Low",    color: "var(--fg-faint)" },
];

export function ClickUpTask({
  intent = CLICKUP_TASK_DEFAULT,
  onResult,
}: {
  intent?: ClickUpTaskIntent;
  onResult?: (r: ReviewResult<ClickUpTaskPayload>) => void;
}) {
  const [name, setName] = React.useState(intent.name);
  const [description, setDescription] = React.useState(intent.description);
  const [status, setStatus] = React.useState(intent.status);
  const [priority, setPriority] = React.useState<ClickUpPriority | undefined>(intent.priority);
  const [dueDate, setDueDate] = React.useState(intent.dueDate ?? "");
  const [timeEstimate, setTimeEstimate] = React.useState(intent.timeEstimate ?? "");

  const edited =
    name !== intent.name ||
    description !== intent.description ||
    status !== intent.status ||
    priority !== intent.priority ||
    dueDate !== (intent.dueDate ?? "") ||
    timeEstimate !== (intent.timeEstimate ?? "");

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      list: intent.list, status, name, description,
      priority,
      assignees: intent.assignees.map(a => a.name),
      watchers: (intent.watchers ?? []).map(w => w.name),
      dueDate: dueDate || undefined,
      timeEstimate: timeEstimate || undefined,
    },
    summary: `${intent.list} · ${name.slice(0, 56)}${name.length > 56 ? "…" : ""}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "ClickUp task cancelled" });

  const curStatus = intent.statusOptions.find(s => s.label === status) || intent.statusOptions[0]!;
  const curPriority = priority ? PRIORITIES.find(p => p.id === priority) : undefined;

  return (
    <ModalShell
      width={720}
      accent={ACCENT}
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)", gap: 12,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <span style={{
            fontSize: 11.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-muted)",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            {intent.space && (<><Icon.Layers size={11} />{intent.space}<span style={{ color: "var(--fg-faint)" }}>/</span></>)}
            {intent.list}
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
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
            <Kbd>⌘</Kbd> <Kbd>↵</Kbd> to create
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Plus size={13} />} onClick={submit}>
            {edited ? "Create edited" : "Create task"}
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

      <div style={{ padding: "16px 18px" }}>
        {/* Status pill + priority flag inline */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <StatusBadge
            current={curStatus}
            options={intent.statusOptions}
            onChange={setStatus}
          />
          <PriorityFlag
            current={curPriority}
            onChange={setPriority}
          />
        </div>

        {/* Name */}
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Task name"
          style={{
            width: "100%",
            background: "transparent",
            border: 0, outline: 0,
            fontSize: 19, fontWeight: 600, letterSpacing: -0.2,
            color: "var(--fg)", padding: "4px 0", marginBottom: 12,
          }}
        />

        {/* Inline metadata */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "100px 1fr",
          rowGap: 8, columnGap: 12,
          fontSize: 12.5, marginBottom: 14,
        }}>
          <span style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)", fontSize: 11 }}>Assignees</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {intent.assignees.map(a => <Avatar key={a.name} name={a.name} size={22} ring />)}
            <button style={{
              width: 22, height: 22, borderRadius: 999,
              background: "transparent",
              border: "1px dashed var(--border-strong)",
              color: "var(--fg-faint)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}>
              <Icon.Plus size={11} />
            </button>
          </div>

          <span style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)", fontSize: 11 }}>Due date</span>
          <input
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            placeholder="No due date"
            style={{
              background: "transparent", border: 0, outline: 0,
              fontSize: 12.5, color: dueDate ? "var(--fg)" : "var(--fg-faint)",
            }}
          />

          <span style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)", fontSize: 11 }}>Time est.</span>
          <input
            value={timeEstimate}
            onChange={e => setTimeEstimate(e.target.value)}
            placeholder="0m"
            style={{
              background: "transparent", border: 0, outline: 0,
              fontSize: 12.5, color: timeEstimate ? "var(--fg)" : "var(--fg-faint)",
              fontFamily: "var(--font-mono)",
            }}
          />

          {(intent.watchers?.length ?? 0) > 0 && (
            <>
              <span style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)", fontSize: 11 }}>Watchers</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {intent.watchers!.map(w => <Avatar key={w.name} name={w.name} size={20} />)}
                <span style={{ fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>
                  {intent.watchers!.length} watching
                </span>
              </div>
            </>
          )}
        </div>

        {/* Description */}
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={6}
          placeholder="Description"
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border-faint)",
            borderRadius: 8, outline: 0,
            fontSize: 13, lineHeight: 1.55,
            color: "var(--fg-muted)",
            fontFamily: "var(--font-sans)",
          }}
        />

        {(intent.tags?.length ?? 0) > 0 && (
          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 4 }}>
            {intent.tags!.map(t => (
              <span key={t} style={{
                fontSize: 11, padding: "2px 8px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border)", borderRadius: 999,
                color: "var(--fg-muted)", fontFamily: "var(--font-mono)",
              }}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </ModalShell>
  );
}

function StatusBadge({
  current, options, onChange,
}: {
  current: { label: string; color: string };
  options: { label: string; color: string }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          height: 24, padding: "0 10px",
          background: `color-mix(in oklch, ${current.color} 18%, transparent)`,
          border: `1px solid color-mix(in oklch, ${current.color} 36%, transparent)`,
          borderRadius: 4,
          fontSize: 11.5, fontWeight: 600,
          color: current.color, cursor: "pointer",
          letterSpacing: 0.4, textTransform: "uppercase",
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: 999, background: current.color }} />
        {current.label}
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0,
          minWidth: 160, background: "var(--bg-card)",
          border: "1px solid var(--border)", borderRadius: 6,
          padding: 4, zIndex: 10,
          boxShadow: "0 12px 30px -8px rgb(0 0 0 / .55)",
        }}>
          {options.map(o => (
            <button
              key={o.label}
              onClick={() => { onChange(o.label); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                width: "100%", padding: "5px 8px",
                fontSize: 12, color: "var(--fg)",
                background: "transparent",
                borderRadius: 4, textAlign: "left", cursor: "pointer",
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 999, background: o.color }} />
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PriorityFlag({
  current, onChange,
}: {
  current?: { id: ClickUpPriority; color: string };
  onChange: (p: ClickUpPriority | undefined) => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          height: 24, padding: "0 8px",
          background: "var(--bg-inset)",
          border: "1px solid var(--border)",
          borderRadius: 4,
          fontSize: 11.5,
          color: current ? current.color : "var(--fg-muted)",
          cursor: "pointer",
        }}
      >
        <Icon.Flag size={11} style={{ color: current ? current.color : "var(--fg-faint)" }} />
        {current ? current.id : "Set priority"}
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0,
          minWidth: 130, background: "var(--bg-card)",
          border: "1px solid var(--border)", borderRadius: 6,
          padding: 4, zIndex: 10,
          boxShadow: "0 12px 30px -8px rgb(0 0 0 / .55)",
        }}>
          {PRIORITIES.map(p => (
            <button
              key={p.id}
              onClick={() => { onChange(p.id); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                width: "100%", padding: "5px 8px",
                fontSize: 12, color: "var(--fg)",
                background: "transparent",
                borderRadius: 4, textAlign: "left", cursor: "pointer",
              }}
            >
              <Icon.Flag size={11} style={{ color: p.color }} />
              {p.id}
            </button>
          ))}
          <button
            onClick={() => { onChange(undefined); setOpen(false); }}
            style={{
              display: "block", width: "100%", padding: "5px 8px",
              fontSize: 11.5, color: "var(--fg-faint)",
              background: "transparent", borderRadius: 4,
              textAlign: "left", cursor: "pointer",
            }}
          >Clear</button>
        </div>
      )}
    </div>
  );
}

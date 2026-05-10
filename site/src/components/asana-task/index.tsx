import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { ASANA_TASK_DEFAULT } from "./types";
import type { AsanaTaskIntent, AsanaTaskPayload, AsanaPriority, AsanaCustomField } from "./types";

export type { AsanaTaskIntent, AsanaTaskPayload, AsanaPriority, AsanaCustomField } from "./types";
export { ASANA_TASK_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.18 25)";

const PRIORITIES: Array<{ id: AsanaPriority; color: string; label: string }> = [
  { id: "Low",    color: "oklch(0.62 0.10 220)", label: "Low" },
  { id: "Medium", color: "oklch(0.74 0.13 60)",  label: "Medium" },
  { id: "High",   color: ACCENT,                  label: "High" },
];

export function AsanaTask({
  intent = ASANA_TASK_DEFAULT,
  onResult,
}: {
  intent?: AsanaTaskIntent;
  onResult?: (r: ReviewResult<AsanaTaskPayload>) => void;
}) {
  const [title, setTitle] = React.useState(intent.title);
  const [description, setDescription] = React.useState(intent.description);
  const [dueDate, setDueDate] = React.useState(intent.dueDate ?? "");
  const [priority, setPriority] = React.useState<AsanaPriority | undefined>(intent.priority);
  const [section, setSection] = React.useState(intent.section);

  const edited =
    title !== intent.title ||
    description !== intent.description ||
    dueDate !== (intent.dueDate ?? "") ||
    priority !== intent.priority ||
    section !== intent.section;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      project: intent.project,
      section,
      title, description,
      dueDate: dueDate || undefined,
      assignee: intent.assignee.name,
      priority,
      customFields: Object.fromEntries((intent.customFields ?? []).map(f => [f.name, f.value])),
    },
    summary: `${intent.project} · ${title.slice(0, 56)}${title.length > 56 ? "…" : ""}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Asana task cancelled" });

  return (
    <ModalShell
      width={700}
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
            fontSize: 11.5, fontFamily: "var(--font-mono)",
            color: ACCENT,
            padding: "3px 8px",
            border: `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)`,
            background: `color-mix(in oklch, ${ACCENT} 10%, transparent)`,
            borderRadius: 6,
          }}>
            <Icon.Layers size={11} />
            {intent.project}
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
            new task
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
            <Kbd>⌘</Kbd> <Kbd>↵</Kbd> to create
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Plus size={13} />} onClick={submit}>
            {edited ? "Create edited task" : "Create task"}
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
        {/* Title with circular check affordance */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
          <span style={{
            width: 22, height: 22, borderRadius: 999,
            border: "2px dashed var(--border-strong)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: "var(--fg-faint)", flexShrink: 0, marginTop: 2,
          }}>
            <Icon.Check size={11} />
          </span>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Task title"
            style={{
              flex: 1,
              background: "transparent",
              border: 0, outline: 0,
              fontSize: 18, fontWeight: 600, letterSpacing: -0.2,
              color: "var(--fg)", padding: "2px 0",
            }}
          />
        </div>

        {/* Inline metadata row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "100px 1fr",
          rowGap: 6, columnGap: 12,
          fontSize: 12.5,
          marginBottom: 14,
        }}>
          <span style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)", fontSize: 11 }}>Assignee</span>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Avatar name={intent.assignee.name} size={20} />
            <span>{intent.assignee.name}</span>
          </div>

          <span style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)", fontSize: 11 }}>Due date</span>
          <input
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            placeholder="No due date"
            style={{
              background: "transparent", border: 0, outline: 0,
              fontSize: 12.5, color: dueDate ? "var(--fg)" : "var(--fg-faint)",
              fontFamily: "var(--font-sans)",
            }}
          />

          <span style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)", fontSize: 11 }}>Section</span>
          <input
            value={section}
            onChange={e => setSection(e.target.value)}
            style={{
              background: "transparent", border: 0, outline: 0,
              fontSize: 12.5, color: "var(--fg)",
            }}
          />

          <span style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)", fontSize: 11 }}>Priority</span>
          <div style={{ display: "inline-flex", gap: 4 }}>
            {PRIORITIES.map(p => {
              const active = priority === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPriority(active ? undefined : p.id)}
                  style={{
                    fontSize: 11, padding: "2px 8px",
                    background: active ? `color-mix(in oklch, ${p.color} 16%, transparent)` : "var(--bg-inset)",
                    color: active ? p.color : "var(--fg-muted)",
                    border: `1px solid ${active ? `color-mix(in oklch, ${p.color} 40%, transparent)` : "var(--border)"}`,
                    borderRadius: 4, cursor: "pointer",
                  }}
                >{p.label}</button>
              );
            })}
          </div>

          {(intent.dependencies ?? 0) > 0 && (
            <>
              <span style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)", fontSize: 11 }}>Dependencies</span>
              <span style={{ fontSize: 12.5, color: "var(--fg-muted)" }}>
                {intent.dependencies} task{intent.dependencies === 1 ? "" : "s"} blocking
              </span>
            </>
          )}
        </div>

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

        {/* Custom fields row */}
        {(intent.customFields?.length ?? 0) > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{
              fontSize: 10.5, fontFamily: "var(--font-mono)",
              color: "var(--fg-faint)", letterSpacing: 0.6,
              textTransform: "uppercase", marginBottom: 8,
            }}>
              Custom fields
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 6,
            }}>
              {intent.customFields!.map(f => (
                <div key={f.name} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 10px",
                  background: "var(--bg-inset)",
                  border: "1px solid var(--border-faint)",
                  borderRadius: 6,
                  fontSize: 12,
                }}>
                  <span style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
                    {f.name}
                  </span>
                  <div style={{ flex: 1 }} />
                  <span style={{
                    fontSize: 11, fontWeight: 500,
                    color: f.color || "var(--fg)",
                    padding: "2px 8px",
                    background: f.color ? `color-mix(in oklch, ${f.color} 14%, transparent)` : "var(--bg-card)",
                    border: `1px solid ${f.color ? `color-mix(in oklch, ${f.color} 30%, transparent)` : "var(--border)"}`,
                    borderRadius: 999,
                  }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(intent.tags?.length ?? 0) > 0 && (
          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 4 }}>
            {intent.tags!.map(t => (
              <span key={t} style={{
                fontSize: 11, padding: "2px 8px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border)", borderRadius: 999,
                color: "var(--fg-muted)", fontFamily: "var(--font-mono)",
              }}>#{t}</span>
            ))}
          </div>
        )}
      </div>
    </ModalShell>
  );
}

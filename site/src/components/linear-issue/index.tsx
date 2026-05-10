import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, Dot, Kbd, ModalShell, Pill, hashHue,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { LINEAR_DEFAULT } from "./types";
import type { LinearIntent, LinearPayload, LinearPriority } from "./types";

export type { LinearIntent, LinearPayload, LinearPriority } from "./types";
export { LINEAR_DEFAULT } from "./types";

const PRIORITIES: Array<{ id: LinearPriority; label: string; color: string; glyph: string }> = [
  { id: "No",     label: "No priority", color: "var(--fg-faint)",     glyph: "—" },
  { id: "Low",    label: "Low",         color: "oklch(0.70 0.10 220)", glyph: "▁" },
  { id: "Med",    label: "Medium",      color: "oklch(0.78 0.13 95)",  glyph: "▂▃" },
  { id: "High",   label: "High",        color: "oklch(0.74 0.15 50)",  glyph: "▂▃▄" },
  { id: "Urgent", label: "Urgent",      color: "var(--c-err)",         glyph: "!" },
];

export function LinearIssue({
  intent = LINEAR_DEFAULT,
  onResult,
}: {
  intent?: LinearIntent;
  onResult?: (r: ReviewResult<LinearPayload>) => void;
}) {
  const [title, setTitle] = React.useState(intent.title);
  const [description, setDescription] = React.useState(intent.description);
  const [priority, setPriority] = React.useState<LinearPriority>(intent.priority);
  const [labels, setLabels] = React.useState<string[]>(intent.labels);
  const [edited, setEdited] = React.useState(false);

  React.useEffect(() => {
    setEdited(
      title !== intent.title ||
      description !== intent.description ||
      priority !== intent.priority ||
      JSON.stringify(labels) !== JSON.stringify(intent.labels)
    );
  }, [title, description, priority, labels, intent]);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { title, description, priority, labels },
    summary: `${intent.identifier} · ${title.slice(0, 56)}${title.length > 56 ? "…" : ""}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: `Issue ${intent.identifier} cancelled` });

  return (
    <ModalShell
      width={760}
      accent="var(--c-linear)"
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)", gap: 12,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11.5,
            color: "var(--c-linear)",
            padding: "3px 8px",
            border: "1px solid color-mix(in oklch, var(--c-linear) 30%, transparent)",
            background: "color-mix(in oklch, var(--c-linear) 10%, transparent)",
            borderRadius: 6,
          }}>
            {intent.identifier}
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
            new issue · {intent.team}
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
            {edited ? "Create edited issue" : "Create issue"}
          </Button>
        </div>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", minHeight: 380 }}>
        <div style={{
          padding: "18px 18px 18px 22px",
          borderRight: "1px solid var(--border-faint)",
        }}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Issue title"
            style={{
              width: "100%",
              background: "transparent",
              border: 0, outline: 0,
              fontSize: 18, fontWeight: 600, letterSpacing: -0.2,
              color: "var(--fg)", padding: "2px 0", marginBottom: 8,
            }}
          />

          {intent.rationale && (
            <div style={{
              display: "flex", gap: 8,
              padding: "10px 12px",
              background: "color-mix(in oklch, var(--c-linear) 6%, transparent)",
              border: "1px solid color-mix(in oklch, var(--c-linear) 20%, transparent)",
              borderRadius: 8,
              fontSize: 12.5, color: "var(--fg-muted)",
              margin: "8px 0 14px", lineHeight: 1.5,
            }}>
              <Icon.Sparkles size={13} style={{ color: "var(--c-linear)", marginTop: 2, flexShrink: 0 }} />
              <span>{intent.rationale}</span>
            </div>
          )}

          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={12}
            placeholder="Add description… markdown supported"
            style={{
              width: "100%",
              background: "transparent",
              border: 0, outline: 0,
              fontSize: 13, fontFamily: "var(--font-mono)",
              color: "var(--fg-muted)", lineHeight: 1.6,
              padding: "4px 0", minHeight: 200,
            }}
          />
        </div>

        <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 14 }}>
          <SidePanelRow icon={<Icon.AlertTriangle size={13} />} label="Priority">
            <PrioritySelect value={priority} onChange={setPriority} />
          </SidePanelRow>

          <SidePanelRow icon={<Icon.Layers size={13} />} label="Status">
            <StatusBadge status={intent.status} />
          </SidePanelRow>

          <SidePanelRow icon={<Icon.User size={13} />} label="Assignee">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Avatar name={intent.assignee.name} size={20} />
              <span style={{ fontSize: 12.5 }}>{intent.assignee.name}</span>
            </div>
          </SidePanelRow>

          <SidePanelRow icon={<Icon.Tag size={13} />} label="Labels">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {labels.map(l => (
                <button
                  key={l}
                  onClick={() => setLabels(labels.filter(x => x !== l))}
                  style={{
                    fontSize: 11,
                    padding: "2px 8px 2px 8px",
                    background: "var(--bg-inset)",
                    border: "1px solid var(--border)", borderRadius: 999,
                    color: "var(--fg-muted)", fontFamily: "var(--font-mono)",
                    display: "inline-flex", alignItems: "center", gap: 4,
                  }}
                >
                  <Dot color={`oklch(0.70 0.13 ${hashHue(l)})`} />
                  {l}
                </button>
              ))}
              <button style={{
                fontSize: 11, width: 22, height: 22,
                background: "transparent",
                border: "1px dashed var(--border-strong)",
                borderRadius: 999, color: "var(--fg-faint)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon.Plus size={11} />
              </button>
            </div>
          </SidePanelRow>

          {intent.cycle && (
            <SidePanelRow icon={<Icon.Calendar size={13} />} label="Cycle">
              <span style={{ fontSize: 12.5, color: "var(--fg-muted)" }}>{intent.cycle}</span>
            </SidePanelRow>
          )}

          {intent.estimate !== undefined && (
            <SidePanelRow icon={<Icon.Flag size={13} />} label="Estimate">
              <div style={{ display: "inline-flex", gap: 2 }}>
                {[1, 2, 3, 5, 8].map(n => (
                  <span key={n} style={{
                    width: 16, height: 16, borderRadius: 4,
                    fontSize: 10, fontFamily: "var(--font-mono)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    background: n === intent.estimate ? "var(--fg)" : "var(--bg-inset)",
                    color: n === intent.estimate ? "var(--bg)" : "var(--fg-faint)",
                    border: `1px solid ${n === intent.estimate ? "var(--fg)" : "var(--border)"}`,
                  }}>{n}</span>
                ))}
              </div>
            </SidePanelRow>
          )}

          <div style={{ flex: 1 }} />

          {(intent.related?.length ?? 0) > 0 && (
            <div style={{
              fontSize: 11, color: "var(--fg-faint)",
              fontFamily: "var(--font-mono)",
              borderTop: "1px solid var(--border-faint)",
              paddingTop: 12,
            }}>
              <div style={{ marginBottom: 6 }}>related</div>
              {intent.related!.map(r => (
                <div key={r} style={{ color: "var(--c-linear)", fontSize: 11.5 }}>{r}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ModalShell>
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

function PrioritySelect({ value, onChange }: {
  value: LinearPriority; onChange: (p: LinearPriority) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const cur = PRIORITIES.find(p => p.id === value) || PRIORITIES[0]!;
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          height: 26, padding: "0 8px",
          background: "var(--bg-inset)",
          border: "1px solid var(--border)", borderRadius: 6,
          fontSize: 12.5, color: cur.color,
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, width: 16, textAlign: "center" }}>
          {cur.glyph}
        </span>
        <span style={{ color: "var(--fg)" }}>{cur.label}</span>
        <Icon.ChevronDown size={12} style={{ color: "var(--fg-faint)" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0,
          minWidth: 180,
          background: "var(--bg-card)",
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
                borderRadius: 6, textAlign: "left",
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: p.color, width: 16, textAlign: "center" }}>{p.glyph}</span>
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      height: 24, padding: "0 8px",
      background: "var(--bg-inset)",
      border: "1px solid var(--border)", borderRadius: 6,
      fontSize: 12.5, color: "var(--fg)",
    }}>
      <span style={{
        width: 10, height: 10, borderRadius: 999,
        border: "1.5px dashed var(--c-warn)",
      }} />
      {status}
    </span>
  );
}

import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, Dot, Kbd, ModalShell, Pill, hashHue,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { SHORTCUT_DEFAULT } from "./types";
import type { ShortcutIntent, ShortcutPayload, ShortcutStoryType } from "./types";

export type { ShortcutIntent, ShortcutPayload, ShortcutStoryType } from "./types";
export { SHORTCUT_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.18 30)";

const TYPES: Array<{ id: ShortcutStoryType; color: string; label: string }> = [
  { id: "feature", color: "oklch(0.66 0.16 145)", label: "feature" },
  { id: "bug",     color: "oklch(0.62 0.20 25)",  label: "bug" },
  { id: "chore",   color: "oklch(0.66 0.06 240)", label: "chore" },
];

const STATES = ["Backlog", "Unscheduled", "Ready for Dev", "In Development", "Ready for Review", "Done"];
const WORKFLOWS = ["Engineering", "Design", "Product", "Growth"];

export function ShortcutStory({
  intent = SHORTCUT_DEFAULT,
  onResult,
}: {
  intent?: ShortcutIntent;
  onResult?: (r: ReviewResult<ShortcutPayload>) => void;
}) {
  const [workflow, setWorkflow] = React.useState(intent.workflow);
  const [state, setState] = React.useState(intent.state);
  const [title, setTitle] = React.useState(intent.title);
  const [description, setDescription] = React.useState(intent.description);
  const [storyType, setStoryType] = React.useState<ShortcutStoryType>(intent.storyType);
  const [labels, setLabels] = React.useState<string[]>(intent.labels);
  const [estimate, setEstimate] = React.useState<number | undefined>(intent.estimate);

  const edited =
    workflow !== intent.workflow ||
    state !== intent.state ||
    title !== intent.title ||
    description !== intent.description ||
    storyType !== intent.storyType ||
    JSON.stringify(labels) !== JSON.stringify(intent.labels) ||
    estimate !== intent.estimate;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      workflow, state, title, description, storyType,
      epicId: intent.epic?.id,
      labels, estimate,
      owners: intent.owners.map(o => o.name),
    },
    summary: `${storyType} · ${title.slice(0, 56)}${title.length > 56 ? "…" : ""}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Story cancelled" });

  const curType = TYPES.find(t => t.id === storyType)!;

  return (
    <ModalShell
      width={760}
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
            sc-new
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
            new story
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
            <Kbd>⌘</Kbd> <Kbd>↵</Kbd> to submit
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Discard</Button>
          <Button variant="primary" size="sm" icon={<Icon.Plus size={13} />} onClick={submit}>
            {edited ? "Create edited story" : "Create story"}
          </Button>
        </div>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 240px", minHeight: 420 }}>
        <div style={{
          padding: "16px 18px",
          borderRight: "1px solid var(--border-faint)",
        }}>
          {/* Story type chips */}
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            {TYPES.map(t => {
              const active = t.id === storyType;
              return (
                <button
                  key={t.id}
                  onClick={() => setStoryType(t.id)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    height: 26, padding: "0 12px",
                    fontSize: 12, fontWeight: 500,
                    background: active ? `color-mix(in oklch, ${t.color} 16%, transparent)` : "var(--bg-inset)",
                    color: active ? t.color : "var(--fg-muted)",
                    border: `1px solid ${active ? `color-mix(in oklch, ${t.color} 40%, transparent)` : "var(--border)"}`,
                    borderRadius: 6, cursor: "pointer",
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: t.color }} />
                  {t.label}
                </button>
              );
            })}
          </div>

          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Story title"
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

          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={12}
            placeholder="Add a description… markdown supported"
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

        <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 14 }}>
          <SidePanelRow icon={<Icon.Layers size={13} />} label="Workflow">
            <Select
              value={workflow}
              options={WORKFLOWS}
              onChange={setWorkflow}
            />
          </SidePanelRow>

          <SidePanelRow icon={<Icon.AlertTriangle size={13} />} label="State">
            <Select
              value={state}
              options={STATES}
              onChange={setState}
              tone={curType.color}
            />
          </SidePanelRow>

          {intent.epic && (
            <SidePanelRow icon={<Icon.Flag size={13} />} label="Epic">
              <span style={{
                fontSize: 11.5, color: "var(--fg)",
                padding: "3px 8px",
                background: `color-mix(in oklch, ${ACCENT} 10%, transparent)`,
                border: `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)`,
                borderRadius: 6,
                display: "inline-block",
              }}>
                {intent.epic.name}
              </span>
            </SidePanelRow>
          )}

          <SidePanelRow icon={<Icon.User size={13} />} label="Owners">
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {intent.owners.map(o => (
                <div key={o.name} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5 }}>
                  <Avatar name={o.name} size={20} />
                  <span>{o.name}</span>
                </div>
              ))}
            </div>
          </SidePanelRow>

          <SidePanelRow icon={<Icon.Flag size={13} />} label="Estimate">
            <div style={{ display: "inline-flex", gap: 4 }}>
              {[1, 2, 3, 5, 8].map(n => (
                <button
                  key={n}
                  onClick={() => setEstimate(n === estimate ? undefined : n)}
                  style={{
                    width: 22, height: 22, borderRadius: 4,
                    fontSize: 11, fontFamily: "var(--font-mono)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    background: n === estimate ? "var(--fg)" : "var(--bg-inset)",
                    color: n === estimate ? "var(--bg)" : "var(--fg-faint)",
                    border: `1px solid ${n === estimate ? "var(--fg)" : "var(--border)"}`,
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
                  <Dot color={`oklch(0.66 0.13 ${hashHue(l)})`} />
                  {l}
                </button>
              ))}
            </div>
          </SidePanelRow>

          {intent.iteration && (
            <SidePanelRow icon={<Icon.Calendar size={13} />} label="Iteration">
              <span style={{ fontSize: 12.5, color: "var(--fg-muted)" }}>{intent.iteration}</span>
            </SidePanelRow>
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

function Select({ value, options, onChange, tone }: {
  value: string; options: string[]; onChange: (v: string) => void; tone?: string;
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
          cursor: "pointer", maxWidth: "100%",
        }}
      >
        {tone && <span style={{ width: 6, height: 6, borderRadius: 999, background: tone }} />}
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
        <Icon.ChevronDown size={12} style={{ color: "var(--fg-faint)", flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0,
          minWidth: 180, background: "var(--bg-card)",
          border: "1px solid var(--border)", borderRadius: 8,
          padding: 4, zIndex: 10,
          boxShadow: "0 12px 30px -8px rgb(0 0 0 / .55)",
        }}>
          {options.map(o => (
            <button
              key={o}
              onClick={() => { onChange(o); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center",
                width: "100%", padding: "6px 8px",
                fontSize: 12.5, color: "var(--fg)",
                background: o === value ? "var(--bg-inset)" : "transparent",
                borderRadius: 6, textAlign: "left", cursor: "pointer",
              }}
            >{o}</button>
          ))}
        </div>
      )}
    </div>
  );
}

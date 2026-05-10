import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { TRELLO_CARD_DEFAULT } from "./types";
import type { TrelloCardIntent, TrelloCardPayload, TrelloLabel } from "./types";

export type { TrelloCardIntent, TrelloCardPayload, TrelloLabel, TrelloChecklistItem } from "./types";
export { TRELLO_CARD_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.13 240)";

export function TrelloCard({
  intent = TRELLO_CARD_DEFAULT,
  onResult,
}: {
  intent?: TrelloCardIntent;
  onResult?: (r: ReviewResult<TrelloCardPayload>) => void;
}) {
  const [title, setTitle] = React.useState(intent.title);
  const [description, setDescription] = React.useState(intent.description);
  const [list, setList] = React.useState(intent.list);
  const [labels, setLabels] = React.useState<TrelloLabel[]>(intent.labels);
  const [dueDate, setDueDate] = React.useState(intent.dueDate ?? "");
  const [checklist, setChecklist] = React.useState(intent.checklist ?? []);

  const edited =
    title !== intent.title ||
    description !== intent.description ||
    list !== intent.list ||
    JSON.stringify(labels) !== JSON.stringify(intent.labels) ||
    dueDate !== (intent.dueDate ?? "") ||
    JSON.stringify(checklist) !== JSON.stringify(intent.checklist ?? []);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      board: intent.board, list,
      title, description,
      labels: labels.map(l => l.name),
      members: intent.members.map(m => m.name),
      dueDate: dueDate || undefined,
    },
    summary: `${intent.board} / ${list} · ${title.slice(0, 56)}${title.length > 56 ? "…" : ""}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Trello card cancelled" });

  const checklistDone = checklist.filter(c => c.done).length;
  const checklistTotal = checklist.length;
  const pct = checklistTotal === 0 ? 0 : Math.round((checklistDone / checklistTotal) * 100);

  return (
    <ModalShell
      width={620}
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
          }}>
            {intent.board} <span style={{ color: "var(--fg-faint)" }}>/</span> {list}
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
            {intent.members.length} member{intent.members.length === 1 ? "" : "s"}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Plus size={13} />} onClick={submit}>
            {edited ? "Add edited card" : "Add card"}
            <span style={{ marginLeft: 6, opacity: .55 }}>
              <Kbd>⌘</Kbd>
              <span style={{ marginLeft: 2 }}><Kbd>↵</Kbd></span>
            </span>
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
        {/* Label chips at top, like a Trello card cover */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
          {labels.map(l => (
            <button
              key={l.name}
              onClick={() => setLabels(labels.filter(x => x.name !== l.name))}
              style={{
                fontSize: 10.5, padding: "3px 10px",
                background: l.color,
                color: "oklch(0.18 0.02 80)",
                border: 0, borderRadius: 4,
                fontFamily: "var(--font-sans)", fontWeight: 600,
                cursor: "pointer", letterSpacing: 0.2,
              }}
            >{l.name}</button>
          ))}
          <button style={{
            fontSize: 11, height: 22, padding: "0 8px",
            background: "transparent",
            border: "1px dashed var(--border-strong)",
            borderRadius: 4, color: "var(--fg-faint)",
            cursor: "pointer",
          }}>+ add label</button>
        </div>

        {/* Title */}
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Card title"
          style={{
            width: "100%",
            background: "transparent",
            border: 0, outline: 0,
            fontSize: 18, fontWeight: 600, letterSpacing: -0.2,
            color: "var(--fg)", padding: "2px 0", marginBottom: 12,
          }}
        />

        {/* List & due date */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "100px 1fr 100px 1fr",
          rowGap: 6, columnGap: 12,
          fontSize: 12.5, marginBottom: 14,
        }}>
          <span style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)", fontSize: 11 }}>List</span>
          <input
            value={list}
            onChange={e => setList(e.target.value)}
            style={{
              background: "transparent", border: 0, outline: 0,
              fontSize: 12.5, color: "var(--fg)",
            }}
          />
          <span style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)", fontSize: 11 }}>Due</span>
          <input
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            placeholder="No due date"
            style={{
              background: "transparent", border: 0, outline: 0,
              fontSize: 12.5, color: dueDate ? "var(--fg)" : "var(--fg-faint)",
            }}
          />
        </div>

        {/* Members row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
            Members
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            {intent.members.map(m => (
              <Avatar key={m.name} name={m.name} size={26} ring />
            ))}
            <button style={{
              width: 26, height: 26, borderRadius: 999,
              background: "transparent",
              border: "1px dashed var(--border-strong)",
              color: "var(--fg-faint)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}>
              <Icon.Plus size={12} />
            </button>
          </div>
        </div>

        {/* Description */}
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 6,
        }}>Description</div>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={5}
          style={{
            width: "100%", padding: "10px 12px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border-faint)",
            borderRadius: 8, outline: 0,
            fontSize: 13, lineHeight: 1.55, color: "var(--fg-muted)",
            fontFamily: "var(--font-sans)",
            marginBottom: 14,
          }}
        />

        {/* Checklist preview */}
        {checklistTotal > 0 && (
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 11, fontFamily: "var(--font-mono)",
              color: "var(--fg-faint)", letterSpacing: 0.6,
              textTransform: "uppercase", marginBottom: 8,
            }}>
              <Icon.Check size={11} />
              <span>Checklist · {checklistDone} / {checklistTotal}</span>
              <div style={{ flex: 1 }} />
              <span style={{ color: "var(--fg-muted)" }}>{pct}%</span>
            </div>
            {/* Progress bar */}
            <div style={{
              height: 4, borderRadius: 999,
              background: "var(--bg-inset)",
              marginBottom: 10, overflow: "hidden",
            }}>
              <div style={{
                width: `${pct}%`, height: "100%",
                background: ACCENT,
                transition: "width .2s ease",
              }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {checklist.map((item, i) => (
                <label key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 12.5,
                  color: item.done ? "var(--fg-faint)" : "var(--fg-muted)",
                  textDecoration: item.done ? "line-through" : "none",
                  cursor: "pointer",
                }}>
                  <input
                    type="checkbox"
                    checked={!!item.done}
                    onChange={e => {
                      const next = [...checklist];
                      next[i] = { ...item, done: e.target.checked };
                      setChecklist(next);
                    }}
                    style={{ accentColor: ACCENT }}
                  />
                  {item.text}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
}

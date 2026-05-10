import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { MONDAY_ITEM_DEFAULT } from "./types";
import type { MondayColumn, MondayItemIntent, MondayItemPayload, MondayStatus } from "./types";

export type { MondayColumn, MondayItemIntent, MondayItemPayload, MondayStatus } from "./types";
export { MONDAY_ITEM_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.18 280)";

export function MondayItem({
  intent = MONDAY_ITEM_DEFAULT,
  onResult,
}: {
  intent?: MondayItemIntent;
  onResult?: (r: ReviewResult<MondayItemPayload>) => void;
}) {
  const [itemName, setItemName] = React.useState(intent.itemName);
  const [columns, setColumns] = React.useState<MondayColumn[]>(intent.columns);

  const edited =
    itemName !== intent.itemName ||
    JSON.stringify(columns) !== JSON.stringify(intent.columns);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      board: intent.board,
      group: intent.group,
      itemName,
      columnValues: Object.fromEntries(columns.map(c => [c.name, c.value])),
    },
    summary: `${intent.board} · ${itemName.slice(0, 56)}${itemName.length > 56 ? "…" : ""}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Monday item cancelled" });

  const updateColumn = (i: number, value: string) => {
    setColumns(prev => {
      const next = [...prev];
      next[i] = { ...next[i]!, value } as MondayColumn;
      return next;
    });
  };

  const groupColor = intent.groupColor || ACCENT;

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
            fontSize: 11.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-muted)",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <Icon.Layers size={11} />
            {intent.board}
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
            new item
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
            <Kbd>⌘</Kbd> <Kbd>↵</Kbd> to add
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Plus size={13} />} onClick={submit}>
            {edited ? "Add edited item" : "Add item"}
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
        {/* Group header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "6px 10px",
          background: `color-mix(in oklch, ${groupColor} 12%, transparent)`,
          border: `1px solid color-mix(in oklch, ${groupColor} 30%, transparent)`,
          borderLeft: `4px solid ${groupColor}`,
          borderRadius: 6, marginBottom: 12,
          fontSize: 12.5,
        }}>
          <Icon.ChevronDown size={12} style={{ color: groupColor }} />
          <span style={{ fontWeight: 600, color: "var(--fg)" }}>{intent.group}</span>
        </div>

        {/* Item row — table-like */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 8, overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: `1.6fr repeat(${columns.length}, minmax(110px, 1fr))`,
            background: "var(--bg-inset)",
            borderBottom: "1px solid var(--border-faint)",
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)",
            textTransform: "uppercase", letterSpacing: 0.6,
          }}>
            <div style={{ padding: "8px 10px", borderRight: "1px solid var(--border-faint)" }}>Item</div>
            {columns.map(c => (
              <div key={c.name} style={{
                padding: "8px 10px",
                borderRight: "1px solid var(--border-faint)",
              }}>{c.name}</div>
            ))}
          </div>

          {/* Body */}
          <div style={{
            display: "grid",
            gridTemplateColumns: `1.6fr repeat(${columns.length}, minmax(110px, 1fr))`,
            alignItems: "center",
          }}>
            <div style={{
              padding: "10px 10px",
              borderRight: "1px solid var(--border-faint)",
              borderLeft: `4px solid ${groupColor}`,
              marginLeft: -4,
            }}>
              <input
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: 0, outline: 0,
                  fontSize: 13.5, fontWeight: 500,
                  color: "var(--fg)",
                  fontFamily: "var(--font-sans)",
                }}
              />
            </div>
            {columns.map((col, i) => (
              <div key={col.name} style={{
                padding: "8px 10px",
                borderRight: "1px solid var(--border-faint)",
                fontSize: 12.5,
              }}>
                <ColumnCell column={col} onChange={v => updateColumn(i, v)} />
              </div>
            ))}
          </div>
        </div>

        <div style={{
          marginTop: 10, fontSize: 11, color: "var(--fg-faint)",
          fontFamily: "var(--font-mono)",
        }}>
          {columns.length} column{columns.length === 1 ? "" : "s"} · click any cell to edit
        </div>
      </div>
    </ModalShell>
  );
}

function ColumnCell({
  column, onChange,
}: {
  column: MondayColumn; onChange: (v: string) => void;
}) {
  if (column.kind === "status") {
    const opt = column.options.find(o => o.label === column.value) || column.options[0]!;
    return <StatusPicker current={opt} options={column.options} onChange={onChange} />;
  }
  if (column.kind === "person") {
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <Avatar name={column.value} size={20} />
        <span style={{ fontSize: 12 }}>{column.value}</span>
      </div>
    );
  }
  if (column.kind === "date") {
    return (
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "2px 8px",
        background: "var(--bg-inset)",
        border: "1px solid var(--border)", borderRadius: 4,
        fontSize: 12, fontFamily: "var(--font-mono)",
      }}>
        <Icon.Calendar size={11} style={{ color: "var(--fg-faint)" }} />
        <input
          value={column.value}
          onChange={e => onChange(e.target.value)}
          style={{
            background: "transparent", border: 0, outline: 0,
            width: 70, fontSize: 12, color: "var(--fg)",
          }}
        />
      </div>
    );
  }
  if (column.kind === "number") {
    return (
      <div style={{ display: "inline-flex", alignItems: "baseline", gap: 4 }}>
        <input
          value={column.value}
          onChange={e => onChange(e.target.value)}
          style={{
            background: "transparent", border: 0, outline: 0,
            width: 40, fontSize: 13, fontWeight: 600, color: "var(--fg)",
            fontFamily: "var(--font-mono)",
          }}
        />
        {column.suffix && (
          <span style={{ fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>
            {column.suffix}
          </span>
        )}
      </div>
    );
  }
  // text
  return (
    <input
      value={column.value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: "100%", background: "transparent",
        border: 0, outline: 0,
        fontSize: 12, color: "var(--fg)",
        fontFamily: "var(--font-mono)",
      }}
    />
  );
}

function StatusPicker({
  current, options, onChange,
}: {
  current: MondayStatus;
  options: MondayStatus[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", padding: "4px 10px",
          background: current.color,
          color: "oklch(0.18 0.02 80)",
          border: 0, borderRadius: 4,
          fontSize: 11.5, fontWeight: 600,
          textAlign: "left", cursor: "pointer",
          letterSpacing: 0.2,
        }}
      >
        {current.label}
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0,
          minWidth: 140,
          background: "var(--bg-card)",
          border: "1px solid var(--border)", borderRadius: 6,
          padding: 4, zIndex: 10,
          boxShadow: "0 12px 30px -8px rgb(0 0 0 / .55)",
        }}>
          {options.map(o => (
            <button
              key={o.label}
              onClick={() => { onChange(o.label); setOpen(false); }}
              style={{
                display: "block", width: "100%",
                padding: "4px 8px", marginBottom: 2,
                background: o.color,
                color: "oklch(0.18 0.02 80)",
                border: 0, borderRadius: 4,
                fontSize: 11.5, fontWeight: 600, textAlign: "left",
                cursor: "pointer", letterSpacing: 0.2,
              }}
            >{o.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { NOTION_DEFAULT } from "./types";
import type { NotionBlock, NotionIntent, NotionPayload, NotionProperty } from "./types";

export type { NotionBlock, NotionIntent, NotionPayload, NotionProperty } from "./types";
export { NOTION_DEFAULT } from "./types";

const ACCENT = "oklch(0.78 0.04 80)";

export function NotionPage({
  intent = NOTION_DEFAULT,
  onResult,
}: {
  intent?: NotionIntent;
  onResult?: (r: ReviewResult<NotionPayload>) => void;
}) {
  const [title, setTitle] = React.useState(intent.title);
  const [blocks, setBlocks] = React.useState<NotionBlock[]>(intent.blocks);
  const [properties] = React.useState<NotionProperty[]>(intent.properties);

  const edited =
    title !== intent.title ||
    JSON.stringify(blocks) !== JSON.stringify(intent.blocks);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { parent: intent.parent, title, blocks, properties },
    summary: `${intent.parent} · ${title.slice(0, 56)}${title.length > 56 ? "…" : ""}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Notion update cancelled" });

  const updateBlock = (i: number, patch: Partial<NotionBlock>) => {
    setBlocks(prev => {
      const next = [...prev];
      next[i] = { ...next[i]!, ...patch } as NotionBlock;
      return next;
    });
  };

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
            color: "var(--fg-faint)",
          }}>
            {intent.workspace} · {intent.parent}
          </span>
          <div style={{ flex: 1 }} />
          {intent.isNew && <Pill tone="ok" size="sm">new page</Pill>}
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
            {blocks.length} block{blocks.length === 1 ? "" : "s"} · {properties.length} prop{properties.length === 1 ? "" : "s"}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Save edited" : intent.isNew ? "Create page" : "Save changes"}
          </Button>
        </div>
      }
    >
      {intent.rationale && (
        <div style={{
          display: "flex", gap: 10,
          padding: "12px 16px",
          background: `color-mix(in oklch, ${ACCENT} 8%, transparent)`,
          borderBottom: "1px solid var(--border-faint)",
          fontSize: 12.5, color: "var(--fg-muted)", lineHeight: 1.5,
        }}>
          <Icon.Sparkles size={14} style={{ color: ACCENT, marginTop: 2, flexShrink: 0 }} />
          <span>{intent.rationale}</span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px" }}>
        {/* Page body */}
        <div style={{
          padding: "20px 24px",
          borderRight: "1px solid var(--border-faint)",
          maxHeight: 480, overflowY: "auto",
        }}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Page title"
            style={{
              width: "100%", padding: "4px 0",
              background: "transparent",
              border: 0, outline: 0,
              fontSize: 24, fontWeight: 700, letterSpacing: -0.4,
              color: "var(--fg)",
              fontFamily: "var(--font-sans)",
              marginBottom: 16,
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {blocks.map((b, i) => (
              <BlockEditor key={i} block={b} onChange={patch => updateBlock(i, patch)} />
            ))}
          </div>
        </div>

        {/* Properties */}
        <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase",
            paddingBottom: 6, borderBottom: "1px solid var(--border-faint)",
          }}>
            Properties
          </div>
          {properties.map(p => (
            <div key={p.name} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, color: "var(--fg-faint)" }}>{p.name}</span>
              {p.type === "select" ? (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 12, padding: "2px 8px",
                  background: `color-mix(in oklch, ${p.color || "var(--fg-faint)"} 14%, var(--bg-inset))`,
                  border: `1px solid color-mix(in oklch, ${p.color || "var(--fg-faint)"} 30%, transparent)`,
                  borderRadius: 6,
                  color: p.color || "var(--fg)",
                  alignSelf: "flex-start",
                }}>{p.value}</span>
              ) : (
                <span style={{ fontSize: 12.5, color: "var(--fg)" }}>{p.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}

function BlockEditor({
  block, onChange,
}: {
  block: NotionBlock;
  onChange: (patch: Partial<NotionBlock>) => void;
}) {
  switch (block.type) {
    case "heading": {
      const sizes = { 1: 22, 2: 18, 3: 15 } as const;
      return (
        <input
          value={block.text}
          onChange={e => onChange({ text: e.target.value })}
          style={{
            width: "100%", padding: "6px 0", marginTop: 8,
            background: "transparent",
            border: 0, outline: 0,
            fontSize: sizes[block.level],
            fontWeight: 600, letterSpacing: -0.2,
            color: "var(--fg)",
          }}
        />
      );
    }
    case "paragraph":
      return (
        <textarea
          value={block.text}
          onChange={e => onChange({ text: e.target.value })}
          rows={Math.max(2, Math.ceil(block.text.length / 60))}
          style={{
            width: "100%", padding: "4px 0",
            background: "transparent",
            border: 0, outline: 0,
            fontSize: 14, lineHeight: 1.55,
            color: "var(--fg-muted)",
            fontFamily: "var(--font-sans)",
            display: "block",
          }}
        />
      );
    case "bullet":
      return (
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <span style={{ marginTop: 6, color: "var(--fg-faint)" }}>•</span>
          <input
            value={block.text}
            onChange={e => onChange({ text: e.target.value })}
            style={{
              flex: 1, padding: "2px 0",
              background: "transparent",
              border: 0, outline: 0,
              fontSize: 14, color: "var(--fg-muted)",
            }}
          />
        </div>
      );
    case "todo":
      return (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={!!block.done}
            onChange={e => onChange({ done: e.target.checked })}
            style={{ accentColor: "var(--agent-ui-accent)" }}
          />
          <input
            value={block.text}
            onChange={e => onChange({ text: e.target.value })}
            style={{
              flex: 1, padding: "2px 0",
              background: "transparent",
              border: 0, outline: 0,
              fontSize: 14,
              color: block.done ? "var(--fg-faint)" : "var(--fg-muted)",
              textDecoration: block.done ? "line-through" : "none",
            }}
          />
        </div>
      );
    case "code":
      return (
        <pre style={{
          margin: "4px 0",
          padding: "10px 12px",
          background: "var(--bg-inset)",
          border: "1px solid var(--border-faint)",
          borderRadius: 6,
          fontFamily: "var(--font-mono)", fontSize: 12,
          color: "var(--fg-muted)",
          whiteSpace: "pre-wrap",
        }}>
          <code>{block.text}</code>
        </pre>
      );
  }
}

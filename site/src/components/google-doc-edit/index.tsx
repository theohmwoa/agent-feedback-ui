import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { GDOC_DEFAULT } from "./types";
import type {
  GdocChange, GdocChangeKind, GdocIntent, GdocMode, GdocPayload,
} from "./types";

export type {
  GdocChange, GdocChangeKind, GdocIntent, GdocMode, GdocPayload,
} from "./types";
export { GDOC_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.13 240)";

const KIND_META: Record<GdocChangeKind, { color: string; label: string; icon: React.ReactNode }> = {
  insertion:  { color: "var(--c-ok)",   label: "INSERT",  icon: <Icon.Plus size={11} /> },
  deletion:   { color: "var(--c-err)",  label: "DELETE",  icon: <Icon.Minus size={11} /> },
  formatting: { color: "var(--c-warn)", label: "FORMAT",  icon: <Icon.Bold size={11} /> },
};

const MODE_META: Record<GdocMode, { label: string; description: string; color: string }> = {
  suggesting: {
    label: "Suggesting",
    description: "Edits go in as suggestions; the doc owner approves.",
    color: ACCENT,
  },
  editing: {
    label: "Editing",
    description: "Edits land directly. Reviewable in version history.",
    color: "var(--c-warn)",
  },
};

export function GoogleDocEdit({
  intent = GDOC_DEFAULT,
  onResult,
}: {
  intent?: GdocIntent;
  onResult?: (r: ReviewResult<GdocPayload>) => void;
}) {
  const [mode, setMode] = React.useState<GdocMode>(intent.defaultMode ?? "suggesting");
  const [tab, setTab] = React.useState<"changes" | "preview">("changes");
  const edited = mode !== (intent.defaultMode ?? "suggesting");

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { mode, changes: intent.changes },
    summary: `${intent.docTitle} · ${intent.changes.length} ${mode === "suggesting" ? "suggestions" : "edits"}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Doc edits cancelled" });

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
            fontSize: 11, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)",
          }}>Google Docs</span>
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
            mode · <span style={{ color: MODE_META[mode].color }}>{MODE_META[mode].label.toLowerCase()}</span>
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {mode === "suggesting" ? "Submit suggestions" : "Apply edits"}
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

      {/* Doc title + breadcrumb */}
      <div style={{
        padding: "14px 18px 10px",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          display: "flex", alignItems: "center", gap: 4,
          marginBottom: 6,
        }}>
          {intent.folder.map((seg, i) => (
            <React.Fragment key={i}>
              <span>{seg}</span>
              {i < intent.folder.length - 1 && <Icon.ChevronRight size={10} />}
            </React.Fragment>
          ))}
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "var(--fg)", letterSpacing: -0.2 }}>
          {intent.docTitle}
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{ padding: "14px 18px 8px" }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          textTransform: "uppercase", letterSpacing: 0.6,
          marginBottom: 8,
        }}>Mode</div>
        <div style={{ display: "flex", gap: 6 }}>
          {(["suggesting", "editing"] as GdocMode[]).map(m => {
            const active = mode === m;
            const meta = MODE_META[m];
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1, textAlign: "left",
                  padding: "10px 12px",
                  background: active
                    ? `color-mix(in oklch, ${meta.color} 14%, transparent)`
                    : "var(--bg-inset)",
                  border: `1px solid ${active ? `color-mix(in oklch, ${meta.color} 40%, transparent)` : "var(--border)"}`,
                  borderRadius: 10,
                  color: active ? meta.color : "var(--fg-muted)",
                }}
              >
                <div style={{
                  fontSize: 13, fontWeight: 600,
                  color: active ? meta.color : "var(--fg)",
                }}>{meta.label}</div>
                <div style={{
                  fontSize: 11, color: "var(--fg-faint)",
                  marginTop: 2, lineHeight: 1.4,
                }}>{meta.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        margin: "8px 18px 10px",
      }}>
        {[
          { id: "changes", label: `Changes · ${intent.changes.length}` },
          { id: "preview", label: "Final preview" },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            style={{
              height: 26, padding: "0 10px",
              fontSize: 12, fontWeight: 500,
              color: tab === t.id ? "var(--fg)" : "var(--fg-muted)",
              background: tab === t.id ? "var(--bg-inset)" : "transparent",
              border: "1px solid " + (tab === t.id ? "var(--border)" : "transparent"),
              borderRadius: 6,
            }}
          >{t.label}</button>
        ))}
      </div>

      {/* Body */}
      <div style={{ padding: "0 18px 18px", maxHeight: 320, overflowY: "auto" }}>
        {tab === "changes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {intent.changes.map((c, i) => (
              <ChangeRow key={i} change={c} />
            ))}
          </div>
        )}
        {tab === "preview" && (
          <pre style={{
            margin: 0,
            padding: "12px 14px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border-faint)",
            borderRadius: 10,
            fontSize: 12.5, lineHeight: 1.65,
            color: "var(--fg-muted)",
            whiteSpace: "pre-wrap",
            fontFamily: "var(--font-mono)",
          }}>{intent.finalPreview}</pre>
        )}
      </div>
    </ModalShell>
  );
}

function ChangeRow({ change }: { change: GdocChange }) {
  const meta = KIND_META[change.kind];
  return (
    <div style={{
      display: "flex", gap: 10,
      padding: "10px 12px",
      background: "var(--bg-inset)",
      border: `1px solid color-mix(in oklch, ${meta.color} 24%, var(--border-faint))`,
      borderLeft: `3px solid ${meta.color}`,
      borderRadius: 8,
    }}>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "1px 6px",
        fontFamily: "var(--font-mono)", fontSize: 10,
        fontWeight: 700,
        color: meta.color,
        background: `color-mix(in oklch, ${meta.color} 14%, transparent)`,
        border: `1px solid color-mix(in oklch, ${meta.color} 30%, transparent)`,
        borderRadius: 4,
        height: 18, alignSelf: "flex-start",
      }}>
        {meta.icon}
        {meta.label}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, color: "var(--fg)",
          lineHeight: 1.5,
          textDecoration: change.kind === "deletion" ? "line-through" : "none",
        }}>{change.text}</div>
        {change.context && (
          <div style={{
            fontSize: 11, color: "var(--fg-faint)",
            marginTop: 2, fontFamily: "var(--font-mono)",
          }}>{change.context}</div>
        )}
      </div>
    </div>
  );
}

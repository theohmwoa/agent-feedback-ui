import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { PATCH_DEFAULT } from "./types";
import type { PatchHunk, PatchIntent, PatchLine, PatchPayload } from "./types";

export type { PatchIntent, PatchPayload, PatchHunk, PatchLine, PatchFile } from "./types";
export { PATCH_DEFAULT } from "./types";

const ACCENT = "oklch(0.78 0.10 145)";

export function FilePatchPreview({
  intent = PATCH_DEFAULT,
  onResult,
}: {
  intent?: PatchIntent;
  onResult?: (r: ReviewResult<PatchPayload>) => void;
}) {
  const allHunkIds = React.useMemo(
    () => intent.files.flatMap(f => f.hunks.map(h => h.id)),
    [intent],
  );
  const [approved, setApproved] = React.useState<Set<string>>(() => new Set(allHunkIds));

  const toggleHunk = (id: string) => {
    setApproved(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalAdded = React.useMemo(
    () => intent.files.reduce((acc, f) => acc + f.hunks.reduce((a, h) => a + h.lines.filter(l => l.kind === "add").length, 0), 0),
    [intent],
  );
  const totalDeleted = React.useMemo(
    () => intent.files.reduce((acc, f) => acc + f.hunks.reduce((a, h) => a + h.lines.filter(l => l.kind === "del").length, 0), 0),
    [intent],
  );

  const edited = approved.size !== allHunkIds.length;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      files: intent.files
        .map(f => ({
          ...f,
          hunks: f.hunks.filter(h => approved.has(h.id)),
        }))
        .filter(f => f.hunks.length > 0),
      approvedHunks: Array.from(approved),
    },
    summary: `${approved.size}/${allHunkIds.length} hunks · +${totalAdded} −${totalDeleted}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Patch rejected" });

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
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: "var(--fg-muted)",
          }}>
            <span style={{ color: "var(--c-ok)" }}>+{totalAdded}</span>
            {" "}
            <span style={{ color: "var(--c-err)" }}>−{totalDeleted}</span>
            {" "}
            <span style={{ color: "var(--fg-faint)" }}>· {intent.files.length} file{intent.files.length === 1 ? "" : "s"}</span>
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
            {approved.size} / {allHunkIds.length} hunks approved
          </span>
          <div style={{ flex: 1 }} />
          {edited && approved.size > 0 && <Pill tone="accent" size="sm">partial</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Reject all</Button>
          <Button
            variant="primary"
            size="sm"
            disabled={approved.size === 0}
            icon={<Icon.Check size={13} />}
            onClick={submit}
          >
            {edited ? `Apply ${approved.size}` : "Apply patch"}
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

      <div style={{ maxHeight: 460, overflowY: "auto", padding: "12px 16px 16px" }}>
        {intent.files.map((f, fi) => (
          <div key={fi} style={{ marginBottom: 14 }}>
            {f.hunks.map(h => (
              <HunkBlock
                key={h.id}
                file={f.path}
                hunk={h}
                approved={approved.has(h.id)}
                onToggle={() => toggleHunk(h.id)}
              />
            ))}
          </div>
        ))}
      </div>
    </ModalShell>
  );
}

function HunkBlock({
  file, hunk, approved, onToggle,
}: {
  file: string; hunk: PatchHunk; approved: boolean; onToggle: () => void;
}) {
  return (
    <div style={{
      background: "var(--code-bg)",
      border: "1px solid " + (approved ? "color-mix(in oklch, var(--c-ok) 30%, var(--border))" : "var(--border)"),
      borderRadius: 10, overflow: "hidden",
      marginBottom: 12,
      transition: "border-color .14s",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "8px 12px",
        borderBottom: "1px solid var(--border-faint)",
        background: "var(--bg-inset)",
      }}>
        <Icon.Code size={12} style={{ color: "var(--fg-faint)" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--fg)" }}>{file}</span>
        <div style={{ flex: 1 }} />
        <button
          onClick={onToggle}
          aria-pressed={approved}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            height: 24, padding: "0 10px",
            fontSize: 11, fontFamily: "var(--font-mono)",
            border: `1px solid ${approved ? "color-mix(in oklch, var(--c-ok) 40%, transparent)" : "var(--border)"}`,
            background: approved ? "color-mix(in oklch, var(--c-ok) 14%, transparent)" : "var(--bg-card)",
            color: approved ? "var(--c-ok)" : "var(--fg-muted)",
            borderRadius: 999,
          }}
        >
          {approved ? <Icon.Check size={11} /> : <Icon.X size={11} />}
          {approved ? "approved" : "rejected"}
        </button>
      </div>

      <div style={{
        padding: "6px 0",
        fontFamily: "var(--font-mono)", fontSize: 12.5,
        lineHeight: 1.55,
      }}>
        <div style={{
          padding: "2px 12px",
          color: "var(--c-linear)",
          fontWeight: 500,
        }}>{hunk.header}</div>
        {hunk.lines.map((l, i) => (
          <DiffLine key={i} line={l} />
        ))}
      </div>
    </div>
  );
}

function DiffLine({ line }: { line: PatchLine }) {
  const styles =
    line.kind === "add" ? {
      bg: "color-mix(in oklch, var(--c-ok) 12%, transparent)",
      mark: "+",
      color: "var(--c-ok)",
    } : line.kind === "del" ? {
      bg: "color-mix(in oklch, var(--c-err) 12%, transparent)",
      mark: "−",
      color: "var(--c-err)",
    } : {
      bg: "transparent",
      mark: " ",
      color: "var(--fg-muted)",
    };
  return (
    <div style={{
      display: "flex",
      background: styles.bg,
      padding: "1px 12px",
    }}>
      <span style={{ width: 36, color: "var(--fg-faint)", textAlign: "right", marginRight: 8 }}>
        {line.line}
      </span>
      <span style={{ width: 14, color: styles.color, textAlign: "center", flexShrink: 0 }}>
        {styles.mark}
      </span>
      <span style={{
        flex: 1, color: line.kind === "ctx" ? "var(--fg)" : styles.color,
        whiteSpace: "pre",
      }}>{line.text || " "}</span>
    </div>
  );
}

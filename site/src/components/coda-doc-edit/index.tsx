import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { CODA_DEFAULT } from "./types";
import type { CodaEdit, CodaEditKind, CodaIntent, CodaPayload } from "./types";

export type {
  CodaEdit, CodaEditKind, CodaIntent, CodaPayload,
} from "./types";
export { CODA_DEFAULT } from "./types";

const ACCENT = "oklch(0.78 0.16 25)";

const KIND_META: Record<CodaEditKind, { color: string; label: string; icon: React.ReactNode }> = {
  "row-insert":     { color: "var(--c-ok)",   label: "ROW +",   icon: <Icon.Plus size={11} /> },
  "row-update":     { color: "var(--c-warn)", label: "ROW Δ",   icon: <Icon.Edit size={11} /> },
  "formula-change": { color: "var(--c-linear)", label: "FORMULA", icon: <Icon.Code size={11} /> },
  "page-create":    { color: ACCENT,          label: "PAGE +",  icon: <Icon.Layers size={11} /> },
  "column-add":     { color: "var(--c-slack)", label: "COL +",   icon: <Icon.Plus size={11} /> },
};

export function CodaDocEdit({
  intent = CODA_DEFAULT,
  onResult,
}: {
  intent?: CodaIntent;
  onResult?: (r: ReviewResult<CodaPayload>) => void;
}) {
  const [shareWithWorkspace, setShareWithWorkspace] = React.useState(intent.shareWithWorkspace ?? false);
  const edited = shareWithWorkspace !== (intent.shareWithWorkspace ?? false);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      doc: intent.doc,
      section: intent.section,
      edits: intent.edits,
      shareWithWorkspace,
    },
    summary: `${intent.doc} · ${intent.edits.length} edit${intent.edits.length === 1 ? "" : "s"}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Coda edits cancelled" });

  // Count of distinct tables affected — derived from targets that mention "/"
  const tableTargets = new Set(
    intent.edits
      .filter(e => e.kind === "row-insert" || e.kind === "row-update" || e.kind === "formula-change" || e.kind === "column-add")
      .map(e => e.target.split("/")[0]?.trim() ?? e.target)
  );
  const affectedTables = tableTargets.size;

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
          }}>Coda</span>
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
            {affectedTables} table{affectedTables === 1 ? "" : "s"} affected
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Apply with edits" : "Apply edits"}
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

      {/* Breadcrumb */}
      <div style={{
        padding: "14px 18px 8px",
      }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          display: "flex", alignItems: "center", gap: 4,
          marginBottom: 4,
        }}>
          <span>Coda</span>
          <Icon.ChevronRight size={10} />
          <span>{intent.doc}</span>
          <Icon.ChevronRight size={10} />
          <span style={{ color: "var(--fg-muted)" }}>{intent.section}</span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "var(--fg)" }}>
          {intent.doc}
        </div>
      </div>

      {/* Edits list */}
      <div style={{
        padding: "8px 18px 14px",
        maxHeight: 360, overflowY: "auto",
      }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          textTransform: "uppercase", letterSpacing: 0.6,
          marginBottom: 8,
        }}>
          {intent.edits.length} proposed edit{intent.edits.length === 1 ? "" : "s"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {intent.edits.map((e, i) => {
            const meta = KIND_META[e.kind];
            return (
              <div key={i} style={{
                display: "flex", gap: 10,
                padding: "10px 12px",
                background: "var(--bg-inset)",
                border: `1px solid color-mix(in oklch, ${meta.color} 24%, var(--border-faint))`,
                borderLeft: `3px solid ${meta.color}`,
                borderRadius: 8,
                alignItems: "flex-start",
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
                  marginTop: 1, flexShrink: 0,
                }}>
                  {meta.icon}
                  {meta.label}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 12.5, color: "var(--fg)",
                    fontWeight: 500,
                  }}>{e.target}</div>
                  <div style={{
                    fontSize: 12, color: "var(--fg-muted)",
                    marginTop: 2, lineHeight: 1.5,
                  }}>{e.detail}</div>
                </div>
                {e.affectedRows !== undefined && (
                  <span style={{
                    fontSize: 11, color: "var(--fg-faint)",
                    fontFamily: "var(--font-mono)",
                    flexShrink: 0,
                  }}>
                    {e.affectedRows} row{e.affectedRows === 1 ? "" : "s"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Share toggle */}
      <div style={{
        padding: "12px 18px",
        borderTop: "1px solid var(--border-faint)",
      }}>
        <label style={{
          display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
        }}>
          <button
            onClick={() => setShareWithWorkspace(!shareWithWorkspace)}
            type="button"
            aria-pressed={shareWithWorkspace}
            style={{
              width: 32, height: 18, borderRadius: 999,
              background: shareWithWorkspace ? "var(--agent-ui-accent)" : "var(--border)",
              border: 0, padding: 0, position: "relative",
              transition: "background .15s",
              flexShrink: 0,
            }}
          >
            <span style={{
              position: "absolute",
              top: 2, left: shareWithWorkspace ? 16 : 2,
              width: 14, height: 14, borderRadius: 999,
              background: "var(--bg-card)",
              transition: "left .15s",
            }} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: "var(--fg)" }}>Share with workspace</div>
            <div style={{ fontSize: 11.5, color: "var(--fg-faint)", marginTop: 1 }}>
              Notify the workspace channel after the edits land.
            </div>
          </div>
        </label>
      </div>
    </ModalShell>
  );
}

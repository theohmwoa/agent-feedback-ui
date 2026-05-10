import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, ModalShell, Pill, Dot, hashHue,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { CONFLUENCE_DEFAULT } from "./types";
import type { ConfluenceIntent, ConfluencePayload, ConfluenceRestriction } from "./types";

export type {
  ConfluenceIntent, ConfluencePayload, ConfluenceRestriction,
} from "./types";
export { CONFLUENCE_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.13 240)";

const RESTRICT_META: Record<ConfluenceRestriction, { label: string; description: string; icon: React.ReactNode }> = {
  open:        { label: "Open",      description: "Anyone in the space can view & edit.",   icon: <Icon.Users size={11} /> },
  "read-only": { label: "Read-only", description: "Anyone can view; only owners can edit.", icon: <Icon.Lock size={11} /> },
  private:     { label: "Private",   description: "Only specified people can view or edit.", icon: <Icon.Lock size={11} /> },
};

export function ConfluencePage({
  intent = CONFLUENCE_DEFAULT,
  onResult,
}: {
  intent?: ConfluenceIntent;
  onResult?: (r: ReviewResult<ConfluencePayload>) => void;
}) {
  const [title, setTitle] = React.useState(intent.title);
  const [body, setBody] = React.useState(intent.body);
  const [labels, setLabels] = React.useState<string[]>(intent.labels);
  const [restriction, setRestriction] = React.useState<ConfluenceRestriction>(intent.restriction ?? "open");

  const edited =
    title !== intent.title ||
    body !== intent.body ||
    JSON.stringify(labels) !== JSON.stringify(intent.labels) ||
    restriction !== (intent.restriction ?? "open");

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { space: intent.space, title, body, labels, restriction },
    summary: `${intent.space} · ${title.slice(0, 56)}${title.length > 56 ? "…" : ""}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Confluence update cancelled" });

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
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 11.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-muted)",
            padding: "2px 8px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 6,
          }}>
            <Icon.Hash size={12} />
            {intent.space}
          </span>
          <div style={{ flex: 1 }} />
          {intent.isNew && <Pill tone="ok" size="sm">new page</Pill>}
          {intent.watchers !== undefined && (
            <span style={{
              fontSize: 11, fontFamily: "var(--font-mono)",
              color: "var(--fg-faint)",
              display: "inline-flex", alignItems: "center", gap: 4,
            }}>
              <Icon.Users size={11} />
              {intent.watchers} watching
            </span>
          )}
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
          <span style={{
            fontSize: 11, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)",
            display: "inline-flex", alignItems: "center", gap: 4,
          }}>
            {RESTRICT_META[restriction].icon}
            {RESTRICT_META[restriction].label.toLowerCase()}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {intent.isNew ? "Publish page" : edited ? "Save edited" : "Save changes"}
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
        padding: "10px 18px",
        borderBottom: "1px solid var(--border-faint)",
        fontSize: 11, fontFamily: "var(--font-mono)",
        color: "var(--fg-faint)",
        display: "flex", alignItems: "center", gap: 4,
      }}>
        {intent.parentBreadcrumb.map((seg, i) => (
          <React.Fragment key={i}>
            <span>{seg}</span>
            {i < intent.parentBreadcrumb.length - 1 && <Icon.ChevronRight size={10} />}
          </React.Fragment>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px" }}>
        {/* Main */}
        <div style={{
          padding: "16px 18px",
          borderRight: "1px solid var(--border-faint)",
        }}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Page title"
            style={{
              width: "100%", padding: "6px 0",
              background: "transparent",
              border: 0, outline: 0,
              fontSize: 24, fontWeight: 700,
              letterSpacing: -0.4, color: "var(--fg)",
              marginBottom: 12,
            }}
          />
          <div style={{
            border: "1px solid var(--border)", borderRadius: 8,
            background: "var(--bg-inset)", overflow: "hidden",
          }}>
            <div style={{
              display: "flex", padding: "6px 10px",
              borderBottom: "1px solid var(--border-faint)",
              fontSize: 11, fontFamily: "var(--font-mono)",
              color: "var(--fg-faint)", gap: 14,
            }}>
              <span style={{ color: "var(--fg)" }}>Wiki</span>
              <span>Preview</span>
              <div style={{ flex: 1 }} />
              <span>wiki / markdown</span>
            </div>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={14}
              placeholder="Page body — wiki markup supported"
              style={{
                width: "100%", padding: "12px 14px",
                background: "transparent",
                border: 0, outline: 0,
                fontFamily: "var(--font-mono)", fontSize: 12.5,
                color: "var(--fg-muted)", lineHeight: 1.65,
                minHeight: 240, display: "block",
              }}
            />
          </div>
        </div>

        {/* Side panel */}
        <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 16 }}>
          <SidePanel label="Labels" icon={<Icon.Tag size={13} />}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {labels.map(l => (
                <button
                  key={l}
                  onClick={() => setLabels(labels.filter(x => x !== l))}
                  style={{
                    fontSize: 11, padding: "2px 8px",
                    background: "var(--bg-inset)",
                    border: "1px solid var(--border)", borderRadius: 999,
                    color: "var(--fg-muted)",
                    fontFamily: "var(--font-mono)",
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
          </SidePanel>

          <SidePanel label="Restrictions" icon={<Icon.Lock size={13} />}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {(["open", "read-only", "private"] as ConfluenceRestriction[]).map(r => {
                const active = restriction === r;
                const meta = RESTRICT_META[r];
                return (
                  <button
                    key={r}
                    onClick={() => setRestriction(r)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "5px 8px",
                      background: active ? `color-mix(in oklch, ${ACCENT} 14%, transparent)` : "transparent",
                      border: `1px solid ${active ? `color-mix(in oklch, ${ACCENT} 40%, transparent)` : "var(--border)"}`,
                      borderRadius: 6,
                      color: active ? ACCENT : "var(--fg-muted)",
                      fontSize: 12, textAlign: "left",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {meta.icon}
                    {meta.label}
                  </button>
                );
              })}
              <span style={{
                fontSize: 11, color: "var(--fg-faint)",
                lineHeight: 1.4, marginTop: 2,
              }}>{RESTRICT_META[restriction].description}</span>
            </div>
          </SidePanel>

          <div style={{ flex: 1 }} />

          <div style={{
            fontSize: 11, color: "var(--fg-faint)",
            fontFamily: "var(--font-mono)",
            borderTop: "1px solid var(--border-faint)",
            paddingTop: 12,
          }}>
            Confluence · {intent.space}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

function SidePanel({ label, icon, children }: {
  label: string; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        fontSize: 10.5, color: "var(--fg-faint)",
        textTransform: "uppercase", letterSpacing: 0.6,
        fontWeight: 500, marginBottom: 8,
      }}>
        {icon}
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

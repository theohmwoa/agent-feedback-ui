import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { SALESFORCE_DEFAULT } from "./types";
import type {
  SalesforceAccountIntent,
  SalesforceAccountPayload,
  SalesforceFieldChange,
} from "./types";

export type {
  SalesforceAccountIntent,
  SalesforceAccountPayload,
  SalesforceFieldChange,
  SalesforceValidation,
} from "./types";
export { SALESFORCE_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.13 220)";

export function SalesforceAccountUpdate({
  intent = SALESFORCE_DEFAULT,
  onResult,
}: {
  intent?: SalesforceAccountIntent;
  onResult?: (r: ReviewResult<SalesforceAccountPayload>) => void;
}) {
  const [changes, setChanges] = React.useState<SalesforceFieldChange[]>(intent.changes);

  const edited = React.useMemo(
    () => JSON.stringify(changes) !== JSON.stringify(intent.changes),
    [changes, intent.changes],
  );

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { accountId: intent.accountId, changes },
    summary: `${intent.accountName} · ${changes.length} field${changes.length === 1 ? "" : "s"} updated`,
  });
  const cancel = () => onResult?.({
    kind: "cancel",
    summary: `Account ${intent.accountName} update cancelled`,
  });

  const updateAfter = (i: number, value: string) => {
    setChanges(prev => {
      const next = [...prev];
      next[i] = { ...next[i]!, after: value };
      return next;
    });
  };

  const removeChange = (i: number) => {
    setChanges(prev => prev.filter((_, idx) => idx !== i));
  };

  const blocking = (intent.requiredMissing?.length ?? 0) > 0
    || (intent.validations?.some(v => v.level === "block") ?? false);

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
            display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: "var(--font-mono)", fontSize: 11.5,
            color: ACCENT,
            padding: "3px 8px",
            border: `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)`,
            background: `color-mix(in oklch, ${ACCENT} 10%, transparent)`,
            borderRadius: 6,
          }}>
            <Icon.Layers size={11} />
            {intent.accountId.slice(0, 12)}…
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
            update account
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
            <Kbd>⌘</Kbd> <Kbd>↵</Kbd> to save
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            disabled={blocking}
            icon={<Icon.Check size={13} />}
            onClick={submit}
          >
            {edited ? "Save edited" : `Save ${changes.length} change${changes.length === 1 ? "" : "s"}`}
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

      {/* Account header */}
      <div style={{
        padding: "16px 18px",
        borderBottom: "1px solid var(--border-faint)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: `color-mix(in oklch, ${ACCENT} 25%, transparent)`,
          color: ACCENT,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 700, fontFamily: "var(--font-mono)",
        }}>
          {intent.accountName.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.2 }}>
            {intent.accountName}
          </div>
          <div style={{
            fontSize: 12, color: "var(--fg-muted)",
            display: "flex", alignItems: "center", gap: 8, marginTop: 2,
          }}>
            <span>{intent.industry}</span>
            {intent.type && <>
              <span style={{ color: "var(--fg-faint)" }}>·</span>
              <span>{intent.type}</span>
            </>}
          </div>
        </div>
      </div>

      {/* Field changes */}
      <div style={{ padding: "16px 18px" }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 10,
        }}>
          Field changes · {changes.length}
        </div>
        {changes.length === 0 ? (
          <div style={{
            padding: "16px",
            fontSize: 13, color: "var(--fg-faint)",
            textAlign: "center",
            border: "1px dashed var(--border)", borderRadius: 8,
          }}>
            All proposed changes removed.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {changes.map((c, i) => (
              <div key={c.field} style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr 1fr 24px",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border-faint)",
                borderRadius: 8,
                fontSize: 13,
              }}>
                <span style={{
                  fontWeight: 500, color: "var(--fg)",
                  fontSize: 12.5,
                }}>
                  {c.label}
                </span>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 12,
                  color: "var(--c-err)",
                  textDecoration: "line-through",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {c.before}
                </span>
                <input
                  value={c.after}
                  onChange={e => updateAfter(i, e.target.value)}
                  style={{
                    padding: "4px 8px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    fontFamily: "var(--font-mono)", fontSize: 12,
                    color: "var(--c-ok)",
                    outline: 0,
                  }}
                />
                <button
                  onClick={() => removeChange(i)}
                  style={{ color: "var(--fg-faint)", padding: 4 }}
                  aria-label={`drop ${c.label}`}
                >
                  <Icon.X size={11} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Validations */}
      {(intent.validations?.length ?? 0) > 0 && (
        <div style={{ padding: "0 18px 12px" }}>
          {intent.validations!.map((v, i) => (
            <div key={i} style={{
              display: "flex", gap: 8,
              padding: "8px 10px",
              background: v.level === "block"
                ? "color-mix(in oklch, var(--c-err) 10%, transparent)"
                : "color-mix(in oklch, var(--c-warn) 10%, transparent)",
              border: `1px solid color-mix(in oklch, ${v.level === "block" ? "var(--c-err)" : "var(--c-warn)"} 28%, transparent)`,
              borderRadius: 6,
              fontSize: 12, lineHeight: 1.5,
              color: v.level === "block" ? "var(--c-err)" : "var(--c-warn)",
              marginBottom: 6,
            }}>
              <Icon.AlertTriangle size={13} style={{ marginTop: 1, flexShrink: 0 }} />
              <span><strong style={{ fontWeight: 600 }}>{v.level === "block" ? "Blocked" : "Warning"}:</strong> {v.rule}</span>
            </div>
          ))}
        </div>
      )}

      {(intent.requiredMissing?.length ?? 0) > 0 && (
        <div style={{ padding: "0 18px 12px" }}>
          <div style={{
            display: "flex", gap: 8,
            padding: "8px 10px",
            background: "color-mix(in oklch, var(--c-err) 10%, transparent)",
            border: "1px solid color-mix(in oklch, var(--c-err) 28%, transparent)",
            borderRadius: 6,
            fontSize: 12, color: "var(--c-err)",
          }}>
            <Icon.AlertTriangle size={13} style={{ marginTop: 1, flexShrink: 0 }} />
            <span>Required fields missing: {intent.requiredMissing!.join(", ")}</span>
          </div>
        </div>
      )}

      {/* Owner */}
      <div style={{
        padding: "12px 18px 16px",
        borderTop: "1px solid var(--border-faint)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <Avatar name={intent.owner.name} size={28} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{intent.owner.name}</div>
          <div style={{
            fontSize: 11, color: "var(--fg-faint)",
            fontFamily: "var(--font-mono)",
          }}>
            {intent.owner.role ? `${intent.owner.role} · ` : ""}{intent.owner.email}
          </div>
        </div>
        <Pill size="xs" tone="default" icon={<Icon.User size={9} />}>
          owner
        </Pill>
      </div>
    </ModalShell>
  );
}

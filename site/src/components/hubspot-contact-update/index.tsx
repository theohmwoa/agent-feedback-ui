import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { HUBSPOT_CONTACT_DEFAULT } from "./types";
import type {
  HubspotContactIntent,
  HubspotContactPayload,
  HubspotLifecycleStage,
  HubspotPropertyChange,
} from "./types";

export type {
  HubspotContactIntent,
  HubspotContactPayload,
  HubspotLifecycleStage,
  HubspotPropertyChange,
} from "./types";
export { HUBSPOT_CONTACT_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.16 25)";

const STAGE_LABEL: Record<HubspotLifecycleStage, string> = {
  subscriber:           "Subscriber",
  lead:                 "Lead",
  marketingqualifiedlead: "MQL",
  salesqualifiedlead:   "SQL",
  opportunity:          "Opportunity",
  customer:             "Customer",
  evangelist:           "Evangelist",
};

export function HubspotContactUpdate({
  intent = HUBSPOT_CONTACT_DEFAULT,
  onResult,
}: {
  intent?: HubspotContactIntent;
  onResult?: (r: ReviewResult<HubspotContactPayload>) => void;
}) {
  const [changes, setChanges] = React.useState<HubspotPropertyChange[]>(intent.changes);
  const [logActivity, setLogActivity] = React.useState(!!intent.logActivity);

  const edited = React.useMemo(
    () =>
      JSON.stringify(changes) !== JSON.stringify(intent.changes) ||
      logActivity !== !!intent.logActivity,
    [changes, logActivity, intent],
  );

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { contactId: intent.contactId, changes, logActivity },
    summary: `${intent.firstName} ${intent.lastName} · ${changes.length} prop${changes.length === 1 ? "" : "s"} updated`,
  });
  const cancel = () => onResult?.({
    kind: "cancel",
    summary: `Contact update cancelled`,
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
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
            HubSpot · contact #{intent.contactId}
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
          <label style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 12, color: "var(--fg-muted)", cursor: "pointer",
          }}>
            <input
              type="checkbox"
              checked={logActivity}
              onChange={e => setLogActivity(e.target.checked)}
              style={{ accentColor: ACCENT }}
            />
            <span>Log activity on timeline</span>
          </label>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Check size={13} />} onClick={submit}>
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

      {/* Contact card */}
      <div style={{
        padding: "16px 18px",
        borderBottom: "1px solid var(--border-faint)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Avatar name={`${intent.firstName} ${intent.lastName}`} size={42} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}>
            {intent.firstName} {intent.lastName}
          </div>
          <div style={{
            fontSize: 12, color: "var(--fg-muted)",
            fontFamily: "var(--font-mono)",
          }}>
            {intent.email}
          </div>
          {(intent.jobTitle || intent.company) && (
            <div style={{ fontSize: 12, color: "var(--fg-muted)", marginTop: 2 }}>
              {intent.jobTitle}{intent.jobTitle && intent.company ? " · " : ""}{intent.company}
            </div>
          )}
        </div>
        <Pill
          size="sm"
          tone="default"
          style={{ background: `color-mix(in oklch, ${ACCENT} 14%, var(--bg-inset))`, color: ACCENT, borderColor: `color-mix(in oklch, ${ACCENT} 30%, transparent)` }}
        >
          {STAGE_LABEL[intent.lifecycleStage]}
        </Pill>
      </div>

      {/* Stats strip */}
      <div style={{
        padding: "10px 18px",
        borderBottom: "1px solid var(--border-faint)",
        display: "flex", gap: 24,
        fontSize: 12,
        color: "var(--fg-muted)",
      }}>
        <span>
          <span style={{ color: "var(--fg)", fontWeight: 600 }}>{intent.associatedDeals}</span>{" "}
          associated deal{intent.associatedDeals === 1 ? "" : "s"}
        </span>
        <span>
          <span style={{ color: "var(--fg)", fontWeight: 600 }}>{intent.associatedCompanies}</span>{" "}
          associated compan{intent.associatedCompanies === 1 ? "y" : "ies"}
        </span>
      </div>

      {/* Property changes */}
      <div style={{ padding: "16px 18px" }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 10,
        }}>
          Properties · {changes.length}
        </div>
        {changes.length === 0 ? (
          <div style={{
            padding: "16px",
            fontSize: 13, color: "var(--fg-faint)",
            textAlign: "center",
            border: "1px dashed var(--border)", borderRadius: 8,
          }}>No properties to update.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {changes.map((c, i) => (
              <div key={c.property} style={{
                display: "grid",
                gridTemplateColumns: "150px 1fr 1fr 24px",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border-faint)",
                borderRadius: 8,
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{c.label}</div>
                  <div style={{
                    fontSize: 10, fontFamily: "var(--font-mono)",
                    color: "var(--fg-faint)",
                  }}>{c.property}</div>
                </div>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: 11.5,
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
                    border: "1px solid var(--border)", borderRadius: 6,
                    fontFamily: "var(--font-mono)", fontSize: 11.5,
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
    </ModalShell>
  );
}

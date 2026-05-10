import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { CLOSE_LEAD_DEFAULT } from "./types";
import type {
  CloseCustomField,
  CloseLeadIntent,
  CloseLeadPayload,
  CloseLeadStatus,
} from "./types";

export type {
  CloseCustomField,
  CloseLeadIntent,
  CloseLeadPayload,
  CloseLeadStatus,
} from "./types";
export { CLOSE_LEAD_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.13 280)";

const STATUS_TONE: Record<CloseLeadStatus["type"], string> = {
  active:    "var(--c-warn)",
  won:       "var(--c-ok)",
  lost:      "var(--c-err)",
  potential: "var(--fg-faint)",
};

function formatAmount(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency, maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function CloseLeadUpdate({
  intent = CLOSE_LEAD_DEFAULT,
  onResult,
}: {
  intent?: CloseLeadIntent;
  onResult?: (r: ReviewResult<CloseLeadPayload>) => void;
}) {
  const [statusId, setStatusId] = React.useState(intent.proposedStatusId);
  const [customFields, setCustomFields] = React.useState<CloseCustomField[]>(intent.customFields);
  const [open, setOpen] = React.useState(false);

  const edited =
    statusId !== intent.proposedStatusId ||
    JSON.stringify(customFields) !== JSON.stringify(intent.customFields);

  const currentStatus = intent.statuses.find(s => s.id === intent.currentStatusId);
  const newStatus = intent.statuses.find(s => s.id === statusId);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      leadId: intent.leadId,
      statusId,
      customFields: customFields.map(f => ({ key: f.key, value: f.value })),
    },
    summary: `${intent.companyName} → ${newStatus?.label ?? "status"}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: `Lead ${intent.companyName} update cancelled` });

  const updateField = (i: number, value: string) => {
    setCustomFields(prev => {
      const next = [...prev];
      next[i] = { ...next[i]!, value };
      return next;
    });
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
            Close · {intent.leadId}
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
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
            last activity: {intent.lastActivity}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Check size={13} />} onClick={submit}>
            {edited ? "Save edited" : "Save changes"}
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

      {/* Lead card */}
      <div style={{
        padding: "16px 18px",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 12, marginBottom: 8,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: `color-mix(in oklch, ${ACCENT} 22%, transparent)`,
            color: ACCENT,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700,
          }}>{intent.companyName.charAt(0)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}>
              {intent.companyName}
            </div>
            {intent.url && (
              <div style={{
                fontSize: 12, color: "var(--fg-muted)",
                fontFamily: "var(--font-mono)",
              }}>{intent.url}</div>
            )}
          </div>
          {currentStatus && (
            <Pill size="sm" tone="default" style={{
              color: STATUS_TONE[currentStatus.type],
              background: `color-mix(in oklch, ${STATUS_TONE[currentStatus.type]} 12%, transparent)`,
              borderColor: `color-mix(in oklch, ${STATUS_TONE[currentStatus.type]} 28%, transparent)`,
            }}>
              {currentStatus.label}
            </Pill>
          )}
        </div>
        {intent.description && (
          <div style={{ fontSize: 12.5, color: "var(--fg-muted)" }}>
            {intent.description}
          </div>
        )}
      </div>

      {/* Status change picker */}
      <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border-faint)" }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 8,
        }}>Change status</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {currentStatus && (
            <Pill size="sm" tone="default" style={{
              color: STATUS_TONE[currentStatus.type],
              background: `color-mix(in oklch, ${STATUS_TONE[currentStatus.type]} 12%, transparent)`,
              borderColor: `color-mix(in oklch, ${STATUS_TONE[currentStatus.type]} 28%, transparent)`,
            }}>
              {currentStatus.label}
            </Pill>
          )}
          <Icon.ArrowRight size={12} style={{ color: "var(--fg-faint)" }} />
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setOpen(o => !o)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 10px",
                background: `color-mix(in oklch, ${ACCENT} 14%, transparent)`,
                border: `1px solid color-mix(in oklch, ${ACCENT} 32%, transparent)`,
                borderRadius: 999,
                fontSize: 12, fontWeight: 500,
                color: ACCENT,
              }}
            >
              {newStatus?.label}
              <Icon.ChevronDown size={11} />
            </button>
            {open && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0,
                minWidth: 200,
                background: "var(--bg-card)",
                border: "1px solid var(--border)", borderRadius: 8,
                padding: 4, zIndex: 10,
                boxShadow: "0 12px 30px -8px rgb(0 0 0 / .55)",
              }}>
                {intent.statuses.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setStatusId(s.id); setOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      width: "100%", padding: "6px 8px",
                      fontSize: 12, color: "var(--fg)",
                      background: s.id === statusId ? "var(--bg-inset)" : "transparent",
                      borderRadius: 6, textAlign: "left",
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: STATUS_TONE[s.type] }} />
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Opportunities + Address */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <div style={{ padding: "12px 18px", borderRight: "1px solid var(--border-faint)" }}>
          <div style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 4,
          }}>Opportunities</div>
          <div style={{ fontSize: 13 }}>
            <span style={{ fontWeight: 600 }}>{intent.opportunitiesCount}</span>
            <span style={{ color: "var(--fg-muted)" }}> · </span>
            <span style={{ color: ACCENT, fontWeight: 600 }}>
              {formatAmount(intent.opportunitiesValueCents, intent.currency)}
            </span>
          </div>
        </div>
        {intent.address && (
          <div style={{ padding: "12px 18px" }}>
            <div style={{
              fontSize: 10.5, fontFamily: "var(--font-mono)",
              color: "var(--fg-faint)", letterSpacing: 0.6,
              textTransform: "uppercase", marginBottom: 4,
            }}>Address</div>
            <div style={{ fontSize: 12, color: "var(--fg-muted)", lineHeight: 1.4 }}>
              {intent.address.line1}<br />
              {intent.address.city}, {intent.address.state}, {intent.address.country}
            </div>
          </div>
        )}
      </div>

      {/* Custom fields */}
      <div style={{ padding: "12px 18px 16px" }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 8,
        }}>Custom fields</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {customFields.map((f, i) => (
            <div key={f.key} style={{
              display: "grid", gridTemplateColumns: "150px 1fr",
              alignItems: "center", gap: 10,
              padding: "6px 10px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border-faint)",
              borderRadius: 8,
            }}>
              <span style={{
                fontSize: 11.5, fontWeight: 500,
                color: "var(--fg-muted)",
              }}>{f.label}</span>
              <input
                value={f.value}
                onChange={e => updateField(i, e.target.value)}
                style={{
                  padding: "4px 8px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)", borderRadius: 6,
                  fontFamily: f.kind === "url" || f.kind === "number" ? "var(--font-mono)" : "var(--font-sans)",
                  fontSize: 12,
                  color: "var(--fg)", outline: 0,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}

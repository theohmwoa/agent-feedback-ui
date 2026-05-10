import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { HUBSPOT_DEAL_DEFAULT } from "./types";
import type {
  HubspotDealContact,
  HubspotDealIntent,
  HubspotDealPayload,
  HubspotDealType,
} from "./types";

export type {
  HubspotDealContact,
  HubspotDealIntent,
  HubspotDealPayload,
  HubspotDealType,
  HubspotPipelineStage,
} from "./types";
export { HUBSPOT_DEAL_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.16 25)";

function formatAmount(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency, maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function HubspotDealCreate({
  intent = HUBSPOT_DEAL_DEFAULT,
  onResult,
}: {
  intent?: HubspotDealIntent;
  onResult?: (r: ReviewResult<HubspotDealPayload>) => void;
}) {
  const [dealName, setDealName] = React.useState(intent.dealName);
  const [stageId, setStageId] = React.useState(intent.stageId);
  const [amountCents, setAmountCents] = React.useState(intent.amountCents);
  const [closeDate, setCloseDate] = React.useState(intent.closeDate);
  const [dealType, setDealType] = React.useState<HubspotDealType>(intent.dealType);
  const [contacts, setContacts] = React.useState<HubspotDealContact[]>(intent.contacts);

  const edited =
    dealName !== intent.dealName ||
    stageId !== intent.stageId ||
    amountCents !== intent.amountCents ||
    closeDate !== intent.closeDate ||
    dealType !== intent.dealType ||
    JSON.stringify(contacts) !== JSON.stringify(intent.contacts);

  const stage = intent.stages.find(s => s.id === stageId);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      pipelineId: intent.pipelineId,
      stageId,
      dealName,
      amountCents,
      currency: intent.currency,
      closeDate,
      dealType,
      primaryContactEmail: contacts.find(c => c.primary)?.email,
      contactEmails: contacts.map(c => c.email),
    },
    summary: `${dealName} · ${formatAmount(amountCents, intent.currency)} · ${stage?.label ?? "stage"}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Deal creation cancelled" });

  const setPrimary = (email: string) => {
    setContacts(prev => prev.map(c => ({ ...c, primary: c.email === email })));
  };
  const removeContact = (email: string) => {
    setContacts(prev => prev.filter(c => c.email !== email));
  };

  const dollars = (amountCents / 100).toFixed(0);

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
            fontFamily: "var(--font-mono)", fontSize: 11.5,
            color: ACCENT,
            padding: "3px 8px",
            border: `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)`,
            background: `color-mix(in oklch, ${ACCENT} 10%, transparent)`,
            borderRadius: 6,
          }}>
            {intent.pipelineLabel}
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
            HubSpot · new deal
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
            weighted: {formatAmount(Math.round(amountCents * (stage?.probability ?? 0)), intent.currency)}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Plus size={13} />} onClick={submit}>
            {edited ? "Create edited deal" : "Create deal"}
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

      {/* Deal name */}
      <div style={{ padding: "16px 18px 0" }}>
        <input
          value={dealName}
          onChange={e => setDealName(e.target.value)}
          placeholder="Deal name"
          style={{
            width: "100%", padding: "6px 0",
            background: "transparent",
            border: 0, borderBottom: "1px solid var(--border-faint)",
            outline: 0,
            fontSize: 18, fontWeight: 600,
            letterSpacing: -0.2, color: "var(--fg)",
          }}
        />
      </div>

      {/* Big amount */}
      <div style={{
        padding: "20px 24px",
        textAlign: "center",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          textTransform: "uppercase", letterSpacing: 0.6,
          marginBottom: 6,
        }}>Deal amount</div>
        <div style={{ display: "inline-flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontSize: 22, color: "var(--fg-faint)", marginTop: -10 }}>$</span>
          <input
            value={dollars}
            onChange={e => {
              const n = parseInt(e.target.value, 10);
              if (!isNaN(n)) setAmountCents(n * 100);
            }}
            type="number"
            style={{
              width: 240,
              fontSize: 48, fontWeight: 600, letterSpacing: -1.5,
              textAlign: "center",
              background: "transparent",
              border: 0, outline: 0,
              color: "var(--fg)",
            }}
          />
        </div>
      </div>

      {/* Stage selector */}
      <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border-faint)" }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 8,
        }}>Pipeline stage</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {intent.stages.map(s => {
            const active = s.id === stageId;
            return (
              <button
                key={s.id}
                onClick={() => setStageId(s.id)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "5px 9px",
                  background: active
                    ? `color-mix(in oklch, ${ACCENT} 18%, transparent)`
                    : "var(--bg-inset)",
                  border: `1px solid ${active ? ACCENT : "var(--border)"}`,
                  borderRadius: 6,
                  fontSize: 11.5,
                  color: active ? ACCENT : "var(--fg-muted)",
                }}
              >
                <span>{s.label}</span>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10, opacity: .7,
                }}>{Math.round(s.probability * 100)}%</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row: close date + deal type */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 0,
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <div style={{ padding: "12px 18px", borderRight: "1px solid var(--border-faint)" }}>
          <div style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 6,
          }}>Close date</div>
          <input
            value={closeDate}
            onChange={e => setCloseDate(e.target.value)}
            style={{
              width: "100%", padding: "6px 8px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)", borderRadius: 6,
              fontFamily: "var(--font-mono)", fontSize: 12,
              color: "var(--fg)", outline: 0,
            }}
          />
        </div>
        <div style={{ padding: "12px 18px" }}>
          <div style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", letterSpacing: 0.6,
            textTransform: "uppercase", marginBottom: 6,
          }}>Deal type</div>
          <div style={{ display: "flex", gap: 4 }}>
            {(["newbusiness", "existingbusiness"] as HubspotDealType[]).map(t => (
              <button
                key={t}
                onClick={() => setDealType(t)}
                style={{
                  flex: 1, padding: "5px 8px",
                  background: dealType === t
                    ? `color-mix(in oklch, ${ACCENT} 18%, transparent)`
                    : "var(--bg-inset)",
                  border: `1px solid ${dealType === t ? ACCENT : "var(--border)"}`,
                  borderRadius: 6,
                  fontSize: 11.5,
                  color: dealType === t ? ACCENT : "var(--fg-muted)",
                }}
              >
                {t === "newbusiness" ? "New business" : "Existing"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contacts */}
      <div style={{ padding: "12px 18px" }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", letterSpacing: 0.6,
          textTransform: "uppercase", marginBottom: 8,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span>Associated contacts · {contacts.length}</span>
          {intent.associatedCompany && (
            <>
              <span style={{ color: "var(--fg-dim)" }}>·</span>
              <span style={{ color: "var(--fg-muted)", textTransform: "none", letterSpacing: 0 }}>
                {intent.associatedCompany}
              </span>
            </>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {contacts.map(c => (
            <div key={c.email} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "6px 10px",
              background: "var(--bg-inset)",
              border: `1px solid ${c.primary ? `color-mix(in oklch, ${ACCENT} 30%, transparent)` : "var(--border-faint)"}`,
              borderRadius: 8,
              fontSize: 13,
            }}>
              <Avatar name={c.name} size={22} />
              <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: 500, fontSize: 12.5 }}>{c.name}</span>
                <span style={{
                  fontSize: 11, color: "var(--fg-faint)",
                  fontFamily: "var(--font-mono)",
                }}>{c.email}</span>
              </div>
              <label style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 11, color: c.primary ? ACCENT : "var(--fg-faint)",
                cursor: "pointer",
              }}>
                <input
                  type="checkbox"
                  checked={!!c.primary}
                  onChange={() => setPrimary(c.email)}
                  style={{ accentColor: ACCENT }}
                />
                primary
              </label>
              <button
                onClick={() => removeContact(c.email)}
                style={{ color: "var(--fg-faint)", padding: 4 }}
                aria-label={`remove ${c.email}`}
              >
                <Icon.X size={11} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}

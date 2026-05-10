import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { STRIPE_INVOICE_SEND_DEFAULT } from "./types";
import type { StripeInvoiceSendIntent, StripeInvoiceSendPayload, InvoiceLineItem } from "./types";

export type { StripeInvoiceSendIntent, StripeInvoiceSendPayload, InvoiceLineItem } from "./types";
export { STRIPE_INVOICE_SEND_DEFAULT } from "./types";

const ACCENT = "oklch(0.74 0.18 290)";

function fmt(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency, maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function StripeInvoiceSend({
  intent = STRIPE_INVOICE_SEND_DEFAULT,
  onResult,
}: {
  intent?: StripeInvoiceSendIntent;
  onResult?: (r: ReviewResult<StripeInvoiceSendPayload>) => void;
}) {
  const [lineItems, setLineItems] = React.useState<InvoiceLineItem[]>(intent.lineItems);
  const [taxRate, setTaxRate] = React.useState(intent.taxRate ?? 0);
  const [discountCents, setDiscountCents] = React.useState(intent.discountCents ?? 0);
  const [dueDate, setDueDate] = React.useState(intent.dueDate);
  const [sendVia, setSendVia] = React.useState<"email" | "link">(intent.sendVia ?? "email");

  const subtotal = lineItems.reduce((a, l) => a + l.quantity * l.unitPriceCents, 0);
  const taxCents = Math.round((subtotal - discountCents) * taxRate);
  const totalCents = subtotal - discountCents + taxCents;

  const edited =
    JSON.stringify(lineItems) !== JSON.stringify(intent.lineItems) ||
    taxRate !== (intent.taxRate ?? 0) ||
    discountCents !== (intent.discountCents ?? 0) ||
    dueDate !== intent.dueDate ||
    sendVia !== (intent.sendVia ?? "email");

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      customerEmail: intent.customer.email,
      invoiceNumber: intent.invoiceNumber,
      currency: intent.currency,
      lineItems, taxRate, discountCents, dueDate, sendVia,
      totalCents,
    },
    summary: `Invoice ${intent.invoiceNumber} · ${fmt(totalCents, intent.currency)}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: `Invoice ${intent.invoiceNumber} cancelled` });

  const updateLine = (i: number, patch: Partial<InvoiceLineItem>) => {
    setLineItems(prev => prev.map((l, idx) => idx === i ? { ...l, ...patch } : l));
  };
  const removeLine = (i: number) => setLineItems(prev => prev.filter((_, idx) => idx !== i));
  const addLine = () => setLineItems(prev => [...prev, { description: "", quantity: 1, unitPriceCents: 0 }]);

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
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11.5,
            color: "var(--fg-muted)", padding: "2px 8px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 6,
          }}>{intent.invoiceNumber}</span>
          <div style={{ flex: 1 }} />
          <Pill tone={intent.livemode ? "warn" : "default"} size="sm">
            {intent.livemode ? "live mode" : "test mode"}
          </Pill>
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
            due <span style={{ color: "var(--fg-muted)" }}>{dueDate}</span>
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="md" icon={<Icon.Send size={14} />} onClick={submit}>
            {edited ? "Send edited invoice" : `Send via ${sendVia}`}
            <span style={{ marginLeft: 6, opacity: .55 }}>
              <Kbd>⌘</Kbd>
              <span style={{ marginLeft: 2 }}><Kbd>↵</Kbd></span>
            </span>
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

      {/* Customer */}
      <div style={{
        padding: "14px 18px",
        borderBottom: "1px solid var(--border-faint)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Avatar name={intent.customer.name} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{intent.customer.name}</div>
          <div style={{ fontSize: 12, color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
            {intent.customer.email}
          </div>
        </div>
      </div>

      {/* Line items */}
      <div style={{ padding: "14px 18px 4px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 50px 90px 90px 24px",
          gap: 8, padding: "0 4px 6px",
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)", textTransform: "uppercase", letterSpacing: 0.6,
        }}>
          <span>Description</span>
          <span style={{ textAlign: "right" }}>Qty</span>
          <span style={{ textAlign: "right" }}>Unit</span>
          <span style={{ textAlign: "right" }}>Total</span>
          <span />
        </div>
        {lineItems.map((line, i) => (
          <div key={i} style={{
            display: "grid",
            gridTemplateColumns: "1fr 50px 90px 90px 24px",
            gap: 8, alignItems: "center",
            padding: "4px",
            borderTop: i === 0 ? "1px solid var(--border-faint)" : "none",
            borderBottom: "1px solid var(--border-faint)",
          }}>
            <input
              value={line.description}
              onChange={e => updateLine(i, { description: e.target.value })}
              style={{
                background: "transparent", border: 0, outline: 0,
                fontSize: 13, color: "var(--fg)", padding: "6px 4px",
              }}
            />
            <input
              type="number"
              min={0}
              value={line.quantity}
              onChange={e => updateLine(i, { quantity: parseInt(e.target.value) || 0 })}
              style={{
                background: "transparent", border: 0, outline: 0,
                fontSize: 13, color: "var(--fg)", padding: "6px 4px",
                textAlign: "right", fontFamily: "var(--font-mono)",
              }}
            />
            <input
              type="number"
              min={0} step={0.01}
              value={(line.unitPriceCents / 100).toFixed(2)}
              onChange={e => updateLine(i, { unitPriceCents: Math.round(parseFloat(e.target.value) * 100) || 0 })}
              style={{
                background: "transparent", border: 0, outline: 0,
                fontSize: 13, color: "var(--fg)", padding: "6px 4px",
                textAlign: "right", fontFamily: "var(--font-mono)",
              }}
            />
            <span style={{
              fontSize: 13, fontFamily: "var(--font-mono)", textAlign: "right",
              color: "var(--fg-muted)",
            }}>
              {fmt(line.quantity * line.unitPriceCents, intent.currency)}
            </span>
            <button
              onClick={() => removeLine(i)}
              style={{ color: "var(--fg-faint)", padding: 4 }}
              aria-label="remove line"
            ><Icon.X size={11} /></button>
          </div>
        ))}
        <button
          onClick={addLine}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            marginTop: 8, fontSize: 12, fontFamily: "var(--font-mono)",
            color: "var(--fg-muted)", padding: "4px 4px",
          }}
        ><Icon.Plus size={11} /> add line</button>
      </div>

      {/* Tax + discount + total */}
      <div style={{
        padding: "12px 18px 16px",
        borderTop: "1px solid var(--border-faint)",
        display: "flex", flexDirection: "column", gap: 6,
      }}>
        <SummaryRow label="Subtotal" value={fmt(subtotal, intent.currency)} />
        <SummaryRow
          label={
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span>Discount</span>
              <input
                type="number"
                min={0} step={0.01}
                value={(discountCents / 100).toFixed(2)}
                onChange={e => setDiscountCents(Math.round(parseFloat(e.target.value) * 100) || 0)}
                style={{
                  width: 70, background: "var(--bg-inset)",
                  border: "1px solid var(--border)", borderRadius: 6,
                  padding: "2px 6px",
                  fontFamily: "var(--font-mono)", fontSize: 12,
                  color: "var(--fg)", outline: 0,
                }}
              />
            </div>
          }
          value={`− ${fmt(discountCents, intent.currency)}`}
          muted
        />
        <SummaryRow
          label={
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span>Tax</span>
              <input
                type="number"
                min={0} step={0.0025}
                value={(taxRate * 100).toFixed(2)}
                onChange={e => setTaxRate((parseFloat(e.target.value) || 0) / 100)}
                style={{
                  width: 60, background: "var(--bg-inset)",
                  border: "1px solid var(--border)", borderRadius: 6,
                  padding: "2px 6px",
                  fontFamily: "var(--font-mono)", fontSize: 12,
                  color: "var(--fg)", outline: 0,
                }}
              />
              <span style={{ fontSize: 11, color: "var(--fg-faint)" }}>%</span>
            </div>
          }
          value={fmt(taxCents, intent.currency)}
          muted
        />
        <div style={{
          marginTop: 6, paddingTop: 10,
          borderTop: "1px solid var(--border-faint)",
          display: "flex", alignItems: "baseline", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 12.5, color: "var(--fg-muted)" }}>Total due</span>
          <span style={{
            fontFamily: "var(--font-mono)", fontWeight: 600,
            fontSize: 22, letterSpacing: -0.3, color: "var(--fg)",
          }}>{fmt(totalCents, intent.currency)}</span>
        </div>
      </div>

      {/* Due date + send via */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
        padding: "12px 18px 16px",
        borderTop: "1px solid var(--border-faint)",
        alignItems: "center",
      }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: 0.6 }}>Due date</span>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            style={{
              background: "var(--bg-inset)",
              border: "1px solid var(--border)", borderRadius: 8,
              padding: "8px 10px",
              fontFamily: "var(--font-mono)", fontSize: 13,
              color: "var(--fg)", outline: 0,
            }}
          />
        </label>
        <div>
          <div style={{ fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>Send via</div>
          <div style={{ display: "flex", gap: 6 }}>
            {(["email", "link"] as const).map(v => (
              <button
                key={v}
                onClick={() => setSendVia(v)}
                style={{
                  flex: 1, padding: "8px 10px",
                  fontSize: 12.5, fontFamily: "var(--font-mono)",
                  background: sendVia === v ? "var(--bg-inset)" : "transparent",
                  border: `1px solid ${sendVia === v ? ACCENT : "var(--border)"}`,
                  color: sendVia === v ? ACCENT : "var(--fg-muted)",
                  borderRadius: 8,
                }}
              >{v}</button>
            ))}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

function SummaryRow({ label, value, muted }: { label: React.ReactNode; value: string; muted?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 12.5, color: muted ? "var(--fg-faint)" : "var(--fg-muted)" }}>{label}</span>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 13,
        color: muted ? "var(--fg-muted)" : "var(--fg)",
      }}>{value}</span>
    </div>
  );
}

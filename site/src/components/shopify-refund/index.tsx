import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { SHOPIFY_REFUND_DEFAULT } from "./types";
import type {
  ShopifyRefundIntent, ShopifyRefundPayload, RefundLineItem, RefundReason,
} from "./types";

export type {
  ShopifyRefundIntent, ShopifyRefundPayload, RefundLineItem, RefundReason,
} from "./types";
export { SHOPIFY_REFUND_DEFAULT } from "./types";

const ACCENT = "oklch(0.78 0.16 145)";
const REASONS: { id: RefundReason; label: string }[] = [
  { id: "customer",  label: "Customer requested" },
  { id: "damaged",   label: "Damaged / defective" },
  { id: "fraud",     label: "Fraudulent" },
  { id: "inventory", label: "Inventory error" },
  { id: "other",     label: "Other" },
];

function fmt(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency, maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function ShopifyRefund({
  intent = SHOPIFY_REFUND_DEFAULT,
  onResult,
}: {
  intent?: ShopifyRefundIntent;
  onResult?: (r: ReviewResult<ShopifyRefundPayload>) => void;
}) {
  const [items, setItems] = React.useState<RefundLineItem[]>(intent.lineItems);
  const [refundShip, setRefundShip] = React.useState(intent.refundShipping ?? false);
  const [reason, setReason] = React.useState<RefundReason>(intent.reason ?? "customer");
  const [asCredit, setAsCredit] = React.useState(intent.asStoreCredit ?? false);

  const itemsCents = items.reduce((a, l) => a + (l.refundQty ?? 0) * l.unitPriceCents, 0);
  const calculated = itemsCents + (refundShip ? intent.shippingCents : 0);
  const [amountCents, setAmountCents] = React.useState(calculated);

  // Recompute when calculated changes (unless user has manually overridden)
  const [touched, setTouched] = React.useState(false);
  React.useEffect(() => {
    if (!touched) setAmountCents(calculated);
  }, [calculated, touched]);

  const edited =
    JSON.stringify(items) !== JSON.stringify(intent.lineItems) ||
    refundShip !== (intent.refundShipping ?? false) ||
    reason !== (intent.reason ?? "customer") ||
    asCredit !== (intent.asStoreCredit ?? false) ||
    amountCents !== calculated;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      orderNumber: intent.orderNumber,
      currency: intent.currency,
      lineItems: items
        .filter(l => (l.refundQty ?? 0) > 0)
        .map(l => ({ sku: l.sku, quantity: l.refundQty ?? 0, restock: !!l.restock })),
      refundShipping: refundShip,
      amountCents,
      reason,
      asStoreCredit: asCredit,
    },
    summary: `${intent.orderNumber} · ${asCredit ? "store credit" : "refund"} ${fmt(amountCents, intent.currency)}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: `Refund for ${intent.orderNumber} cancelled` });

  const updateItem = (i: number, patch: Partial<RefundLineItem>) =>
    setItems(prev => prev.map((l, idx) => idx === i ? { ...l, ...patch } : l));

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
          }}>{intent.orderNumber}</span>
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
            calc · {fmt(calculated, intent.currency)}
            {amountCents !== calculated && (
              <> · <span style={{ color: "var(--c-warn)" }}>manual override</span></>
            )}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="danger" size="md" onClick={submit}>
            {asCredit ? `Issue ${fmt(amountCents, intent.currency)} credit` : `Refund ${fmt(amountCents, intent.currency)}`}
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
        padding: "12px 18px",
        borderBottom: "1px solid var(--border-faint)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Avatar name={intent.customer.name} size={32} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{intent.customer.name}</div>
          <div style={{ fontSize: 11.5, color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
            {intent.customer.email}
          </div>
        </div>
      </div>

      {/* Line items */}
      <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border-faint)" }}>
        {items.map((line, i) => (
          <div key={line.sku} style={{
            display: "grid",
            gridTemplateColumns: "32px 1fr auto auto auto",
            gap: 10, alignItems: "center",
            padding: "8px 0",
            borderTop: i === 0 ? "none" : "1px solid var(--border-faint)",
          }}>
            <div style={{
              width: 32, height: 32,
              background: "var(--bg-inset)",
              border: "1px solid var(--border)", borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon.Image size={13} style={{ color: "var(--fg-faint)" }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{line.title}</div>
              <div style={{ fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>
                {line.variant} · {fmt(line.unitPriceCents, intent.currency)}
              </div>
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 12, fontFamily: "var(--font-mono)",
            }}>
              <input
                type="number"
                min={0} max={line.ordered}
                value={line.refundQty ?? 0}
                onChange={e => {
                  const n = parseInt(e.target.value) || 0;
                  updateItem(i, { refundQty: Math.min(line.ordered, Math.max(0, n)) });
                }}
                style={{
                  width: 44, padding: "4px 6px",
                  background: "var(--bg-inset)",
                  border: "1px solid var(--border)", borderRadius: 6,
                  textAlign: "right",
                  color: "var(--fg)", outline: 0,
                  fontFamily: "var(--font-mono)",
                }}
              />
              <span style={{ color: "var(--fg-faint)" }}>/ {line.ordered}</span>
            </div>
            <label style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 11, color: "var(--fg-muted)",
              cursor: (line.refundQty ?? 0) > 0 ? "pointer" : "not-allowed",
              opacity: (line.refundQty ?? 0) > 0 ? 1 : 0.4,
            }}>
              <input
                type="checkbox"
                checked={!!line.restock}
                disabled={(line.refundQty ?? 0) === 0}
                onChange={e => updateItem(i, { restock: e.target.checked })}
                style={{ accentColor: ACCENT }}
              />
              restock
            </label>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 12.5,
              color: (line.refundQty ?? 0) > 0 ? "var(--fg)" : "var(--fg-faint)",
              minWidth: 70, textAlign: "right",
            }}>
              {fmt((line.refundQty ?? 0) * line.unitPriceCents, intent.currency)}
            </span>
          </div>
        ))}
      </div>

      {/* Shipping */}
      <label style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 18px",
        borderBottom: "1px solid var(--border-faint)",
        cursor: "pointer",
        fontSize: 13, color: "var(--fg-muted)",
      }}>
        <input
          type="checkbox"
          checked={refundShip}
          onChange={e => setRefundShip(e.target.checked)}
          style={{ accentColor: ACCENT }}
        />
        <span style={{ flex: 1 }}>Refund shipping</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: refundShip ? "var(--fg)" : "var(--fg-faint)" }}>
          {fmt(intent.shippingCents, intent.currency)}
        </span>
      </label>

      {/* Reason */}
      <div style={{
        padding: "12px 18px",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          textTransform: "uppercase", letterSpacing: 0.6,
          marginBottom: 8,
        }}>Reason</div>
        <select
          value={reason}
          onChange={e => setReason(e.target.value as RefundReason)}
          style={{
            width: "100%", padding: "8px 10px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 8,
            outline: 0,
            fontSize: 13, color: "var(--fg)",
          }}
        >
          {REASONS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
      </div>

      {/* Total + payout */}
      <div style={{
        padding: "14px 18px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.6 }}>
            Refund amount
          </div>
          <div style={{
            display: "inline-flex", alignItems: "baseline", gap: 4,
            fontFamily: "var(--font-mono)",
          }}>
            <span style={{ fontSize: 16, color: "var(--fg-faint)" }}>
              {intent.currency === "USD" ? "$" : intent.currency}
            </span>
            <input
              type="number"
              min={0} step={0.01}
              value={(amountCents / 100).toFixed(2)}
              onChange={e => {
                setTouched(true);
                setAmountCents(Math.round(parseFloat(e.target.value) * 100) || 0);
              }}
              style={{
                fontSize: 28, fontWeight: 600, letterSpacing: -0.6,
                background: "transparent", border: 0, outline: 0,
                color: "var(--fg)", width: 140,
              }}
            />
          </div>
        </div>
        <div style={{
          display: "inline-flex", padding: 3,
          background: "var(--bg-inset)",
          border: "1px solid var(--border)", borderRadius: 8,
        }}>
          {([
            { id: false, label: "Original payment" },
            { id: true,  label: "Store credit" },
          ] as const).map(o => (
            <button
              key={String(o.id)}
              onClick={() => setAsCredit(o.id)}
              style={{
                padding: "6px 10px",
                fontSize: 11.5, fontFamily: "var(--font-mono)",
                background: asCredit === o.id ? "var(--bg-card)" : "transparent",
                border: `1px solid ${asCredit === o.id ? "var(--border)" : "transparent"}`,
                color: asCredit === o.id ? "var(--fg)" : "var(--fg-muted)",
                borderRadius: 6,
              }}
            >{o.label}</button>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}

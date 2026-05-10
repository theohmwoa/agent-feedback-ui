import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { SHOPIFY_ORDER_FULFILL_DEFAULT } from "./types";
import type {
  ShopifyOrderFulfillIntent, ShopifyOrderFulfillPayload, FulfillLineItem, Carrier,
} from "./types";

export type {
  ShopifyOrderFulfillIntent, ShopifyOrderFulfillPayload, FulfillLineItem, Carrier, ShippingAddress,
} from "./types";
export { SHOPIFY_ORDER_FULFILL_DEFAULT } from "./types";

const ACCENT = "oklch(0.78 0.16 145)";
const CARRIERS: Carrier[] = ["UPS", "USPS", "FedEx", "DHL"];

export function ShopifyOrderFulfill({
  intent = SHOPIFY_ORDER_FULFILL_DEFAULT,
  onResult,
}: {
  intent?: ShopifyOrderFulfillIntent;
  onResult?: (r: ReviewResult<ShopifyOrderFulfillPayload>) => void;
}) {
  const initialQty = (l: FulfillLineItem) => l.fulfillQty ?? l.ordered;
  const [qty, setQty] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(intent.lineItems.map(l => [l.sku, initialQty(l)])),
  );
  const [carrier, setCarrier] = React.useState<Carrier>(intent.carrier ?? "UPS");
  const [tracking, setTracking] = React.useState(intent.trackingNumber ?? "");
  const [notify, setNotify] = React.useState(intent.notifyCustomer ?? true);

  const edited =
    intent.lineItems.some(l => qty[l.sku] !== initialQty(l)) ||
    carrier !== (intent.carrier ?? "UPS") ||
    tracking !== (intent.trackingNumber ?? "") ||
    notify !== (intent.notifyCustomer ?? true);

  const totalUnits = Object.values(qty).reduce((a, b) => a + b, 0);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      orderNumber: intent.orderNumber,
      lineItems: intent.lineItems.map(l => ({ sku: l.sku, quantity: qty[l.sku] ?? 0 })).filter(l => l.quantity > 0),
      carrier, trackingNumber: tracking, notifyCustomer: notify,
    },
    summary: `${intent.orderNumber} · ${totalUnits} units · ${carrier}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: `Fulfillment for ${intent.orderNumber} cancelled` });

  const addr = intent.shippingAddress;

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
            shipping {totalUnits} unit{totalUnits === 1 ? "" : "s"} via {carrier}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="md" icon={<Icon.Send size={14} />} onClick={submit}>
            {edited ? "Fulfill (edited)" : "Fulfill order"}
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
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          textTransform: "uppercase", letterSpacing: 0.6,
          marginBottom: 8,
        }}>Line items · {intent.lineItems.length}</div>
        {intent.lineItems.map(line => (
          <div key={line.sku} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "8px 0",
            borderTop: "1px solid var(--border-faint)",
          }}>
            <div style={{
              width: 36, height: 36,
              background: "var(--bg-inset)",
              border: "1px solid var(--border)", borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Icon.Image size={14} style={{ color: "var(--fg-faint)" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{line.title}</div>
              <div style={{ fontSize: 11.5, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>
                {line.variant} · {line.sku}
              </div>
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 12, fontFamily: "var(--font-mono)",
            }}>
              <input
                type="number"
                min={0} max={line.ordered}
                value={qty[line.sku] ?? 0}
                onChange={e => {
                  const n = parseInt(e.target.value) || 0;
                  setQty(prev => ({ ...prev, [line.sku]: Math.min(line.ordered, Math.max(0, n)) }));
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
          </div>
        ))}
      </div>

      {/* Shipping address */}
      <div style={{
        padding: "12px 18px",
        borderBottom: "1px solid var(--border-faint)",
        fontSize: 12.5, lineHeight: 1.5,
        color: "var(--fg-muted)",
      }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          textTransform: "uppercase", letterSpacing: 0.6,
          marginBottom: 6,
        }}>Ship to</div>
        <div style={{ color: "var(--fg)" }}>{addr.name}</div>
        <div>{addr.line1}{addr.line2 && `, ${addr.line2}`}</div>
        <div>{addr.city}, {addr.state} {addr.postalCode} · {addr.country}</div>
      </div>

      {/* Carrier + tracking */}
      <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border-faint)" }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          textTransform: "uppercase", letterSpacing: 0.6,
          marginBottom: 8,
        }}>Carrier</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {CARRIERS.map(co => (
            <button
              key={co}
              onClick={() => setCarrier(co)}
              style={{
                padding: "6px 12px",
                fontSize: 12.5, fontFamily: "var(--font-mono)", fontWeight: 600,
                background: carrier === co ? `color-mix(in oklch, ${ACCENT} 14%, transparent)` : "var(--bg-inset)",
                border: `1px solid ${carrier === co ? ACCENT : "var(--border)"}`,
                color: carrier === co ? ACCENT : "var(--fg-muted)",
                borderRadius: 6,
              }}
            >{co}</button>
          ))}
        </div>
        <input
          value={tracking}
          onChange={e => setTracking(e.target.value)}
          placeholder="Tracking number"
          style={{
            width: "100%", padding: "8px 10px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 8,
            outline: 0,
            fontSize: 13, fontFamily: "var(--font-mono)",
            color: "var(--fg)",
          }}
        />
      </div>

      {/* Notify */}
      <label style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 18px",
        cursor: "pointer",
        fontSize: 13, color: "var(--fg-muted)",
      }}>
        <input
          type="checkbox"
          checked={notify}
          onChange={e => setNotify(e.target.checked)}
          style={{ accentColor: ACCENT }}
        />
        <span>Email customer with shipping confirmation + tracking</span>
      </label>
    </ModalShell>
  );
}

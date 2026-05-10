import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { PAYPAL_DEFAULT } from "./types";
import type {
  PayPalIntent, PayPalPayload, PayPalPaymentType, PayPalFundingSource,
} from "./types";

export type {
  PayPalIntent, PayPalPayload, PayPalPaymentType, PayPalFundingSource,
} from "./types";
export { PAYPAL_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.13 240)";
const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD"];

function fmt(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency, maximumFractionDigits: 2,
  }).format(cents / 100);
}

// G&S adds a fee. Approx: 2.99% + $0.49 for domestic personal G&S (2026 rates).
function feeCents(amountCents: number, type: PayPalPaymentType) {
  if (type === "friends_family") return 0;
  return Math.round(amountCents * 0.0299) + 49;
}

export function PayPalPayment({
  intent = PAYPAL_DEFAULT,
  onResult,
}: {
  intent?: PayPalIntent;
  onResult?: (r: ReviewResult<PayPalPayload>) => void;
}) {
  const [amountCents, setAmountCents] = React.useState(intent.amountCents);
  const [currency, setCurrency] = React.useState(intent.currency);
  const [description, setDescription] = React.useState(intent.description);
  const [paymentType, setPaymentType] = React.useState<PayPalPaymentType>(intent.paymentType ?? "goods_services");
  const [fundingSource] = React.useState<PayPalFundingSource>(
    intent.fundingSource ?? { kind: "balance", label: "PayPal balance" },
  );

  const fee = feeCents(amountCents, paymentType);
  const total = amountCents + fee;

  const edited =
    amountCents !== intent.amountCents ||
    currency !== intent.currency ||
    description !== intent.description ||
    paymentType !== (intent.paymentType ?? "goods_services");

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      recipientHandle: intent.recipient.handle,
      amountCents, currency, description, paymentType, fundingSource,
    },
    summary: `PayPal · ${intent.recipient.handle} · ${fmt(amountCents, currency)}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "PayPal payment cancelled" });

  const isPersonal = paymentType === "friends_family";

  return (
    <ModalShell
      width={520}
      accent={ACCENT}
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)", gap: 12,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <div style={{ flex: 1 }} />
          <Pill tone={intent.livemode ? "warn" : "default"} size="sm">
            {intent.livemode ? "live mode" : "sandbox"}
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
            you pay <span style={{ color: "var(--fg-muted)" }}>{fmt(total, currency)}</span>
            {fee > 0 && (
              <> · fee <span style={{ color: "var(--c-warn)" }}>{fmt(fee, currency)}</span></>
            )}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant={isPersonal ? "danger" : "primary"}
            size="md"
            icon={<Icon.Send size={14} />}
            onClick={submit}
          >
            {edited ? "Send edited" : `Send ${fmt(amountCents, currency)}`}
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

      {/* Recipient */}
      <div style={{
        padding: "16px 18px",
        borderBottom: "1px solid var(--border-faint)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Avatar name={intent.recipient.name || intent.recipient.handle} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {intent.recipient.name && (
            <div style={{ fontSize: 14, fontWeight: 600 }}>{intent.recipient.name}</div>
          )}
          <div style={{ fontSize: 12, color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
            {intent.recipient.handle}
          </div>
        </div>
      </div>

      {/* Amount */}
      <div style={{
        padding: "28px 24px 22px",
        textAlign: "center",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          textTransform: "uppercase", letterSpacing: 0.6,
          marginBottom: 8,
        }}>Send amount</div>
        <div style={{
          display: "inline-flex", alignItems: "baseline", gap: 6,
          fontFamily: "var(--font-mono)",
        }}>
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            style={{
              background: "transparent",
              border: 0, outline: 0,
              fontSize: 16, color: "var(--fg-faint)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="number"
            step="0.01"
            value={(amountCents / 100).toFixed(2)}
            onChange={e => {
              const n = parseFloat(e.target.value);
              if (!isNaN(n)) setAmountCents(Math.round(n * 100));
            }}
            style={{
              width: 200,
              fontSize: 56, fontWeight: 600, letterSpacing: -2,
              textAlign: "center",
              background: "transparent",
              border: 0, outline: 0,
              color: "var(--fg)",
              fontFamily: "var(--font-sans)",
            }}
          />
        </div>
      </div>

      {/* Payment type */}
      <div style={{
        padding: "12px 18px",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          textTransform: "uppercase", letterSpacing: 0.6,
          marginBottom: 8,
        }}>Payment type</div>
        <div style={{ display: "flex", gap: 6 }}>
          <PaymentTypeOption
            active={paymentType === "goods_services"}
            label="Goods & services"
            sub={`+ ${fmt(feeCents(amountCents, "goods_services"), currency)} fee · buyer protection`}
            onClick={() => setPaymentType("goods_services")}
          />
          <PaymentTypeOption
            active={paymentType === "friends_family"}
            label="Friends & family"
            sub="No fee · no buyer protection"
            warn
            onClick={() => setPaymentType("friends_family")}
          />
        </div>
      </div>

      {/* Description */}
      <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border-faint)" }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          textTransform: "uppercase", letterSpacing: 0.6,
          marginBottom: 8,
        }}>Description</div>
        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{
            width: "100%", padding: "8px 10px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 8,
            outline: 0,
            fontSize: 13, color: "var(--fg)",
          }}
        />
      </div>

      {/* Funding */}
      <div style={{ padding: "12px 18px" }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          textTransform: "uppercase", letterSpacing: 0.6,
          marginBottom: 8,
        }}>Funding source</div>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "8px 10px",
          background: "var(--bg-inset)",
          border: "1px solid var(--border)", borderRadius: 8,
        }}>
          <Icon.Lock size={13} style={{ color: "var(--fg-faint)" }} />
          <span style={{ flex: 1, fontSize: 13, color: "var(--fg)" }}>{fundingSource.label}</span>
          <span style={{
            fontSize: 11, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)",
            textTransform: "uppercase", letterSpacing: 0.6,
          }}>{fundingSource.kind}</span>
        </div>
      </div>
    </ModalShell>
  );
}

function PaymentTypeOption({
  active, label, sub, warn, onClick,
}: {
  active: boolean; label: string; sub: string; warn?: boolean; onClick: () => void;
}) {
  const accent = ACCENT;
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: "10px 12px",
        textAlign: "left",
        background: active
          ? `color-mix(in oklch, ${accent} 12%, transparent)`
          : "var(--bg-inset)",
        border: `1px solid ${active ? accent : "var(--border)"}`,
        borderRadius: 8,
      }}
    >
      <div style={{
        fontSize: 12.5, fontWeight: 500,
        color: active ? accent : "var(--fg)",
        marginBottom: 2,
      }}>{label}</div>
      <div style={{
        fontSize: 11, color: warn && active ? "var(--c-warn)" : "var(--fg-muted)",
      }}>{sub}</div>
    </button>
  );
}

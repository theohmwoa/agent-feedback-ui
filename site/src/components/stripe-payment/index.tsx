import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { STRIPE_DEFAULT } from "./types";
import type { StripeIntent, StripePayload } from "./types";

export type { StripeIntent, StripePayload, StripeKind, StripePaymentMethod } from "./types";
export { STRIPE_DEFAULT } from "./types";

const ACCENT = "oklch(0.74 0.18 290)";

function formatAmount(cents: number, currency: string) {
  const n = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency, maximumFractionDigits: 2,
  }).format(n);
}

export function StripePayment({
  intent = STRIPE_DEFAULT,
  onResult,
}: {
  intent?: StripeIntent;
  onResult?: (r: ReviewResult<StripePayload>) => void;
}) {
  const [amountCents, setAmountCents] = React.useState(intent.amountCents);
  const [description, setDescription] = React.useState(intent.description);
  const edited = amountCents !== intent.amountCents || description !== intent.description;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      kind: intent.kind,
      amountCents,
      currency: intent.currency,
      customerEmail: intent.customer.email,
      description,
      invoice: intent.invoice,
    },
    summary: `${intent.kind} · ${formatAmount(amountCents, intent.currency)}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: `${intent.kind} cancelled` });

  const verb = intent.kind === "refund" ? "Refund" : intent.kind === "charge" ? "Charge" : "Transfer";
  const dollars = (amountCents / 100).toFixed(2);

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
          {intent.invoice && (
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
              {intent.invoice}
            </span>
          )}
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant={intent.kind === "refund" ? "danger" : "primary"}
            size="sm"
            onClick={submit}
          >
            {edited ? `Authorize edited ${intent.kind}` : `Authorize ${verb}`}
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

      {/* Amount */}
      <div style={{
        padding: "28px 24px 24px",
        textAlign: "center",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          textTransform: "uppercase", letterSpacing: 0.6,
          marginBottom: 8,
        }}>{verb} amount</div>
        <div style={{
          display: "inline-flex", alignItems: "baseline", gap: 6,
          fontFamily: "var(--font-mono)",
        }}>
          <span style={{ fontSize: 22, color: "var(--fg-faint)", marginTop: -10 }}>
            {intent.currency === "USD" ? "$" : intent.currency}
          </span>
          <input
            value={dollars}
            onChange={e => {
              const n = parseFloat(e.target.value);
              if (!isNaN(n)) setAmountCents(Math.round(n * 100));
            }}
            type="number"
            step="0.01"
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

      {/* Customer */}
      <div style={{
        padding: "16px 18px",
        borderBottom: "1px solid var(--border-faint)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Avatar name={intent.customer.name} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{intent.customer.name}</div>
          <div style={{ fontSize: 12, color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
            {intent.customer.email}
          </div>
        </div>
        {intent.paymentMethod && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 10px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 8,
            fontFamily: "var(--font-mono)", fontSize: 12,
          }}>
            <span style={{ textTransform: "uppercase", color: "var(--fg-muted)" }}>
              {intent.paymentMethod.brand}
            </span>
            <span style={{ color: "var(--fg)" }}>···· {intent.paymentMethod.last4}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <div style={{ padding: "14px 18px" }}>
        <div style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          color: "var(--fg-faint)",
          textTransform: "uppercase", letterSpacing: 0.6,
          marginBottom: 8,
        }}>Description</div>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          style={{
            width: "100%", padding: "10px 12px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 8,
            outline: 0,
            fontSize: 13, lineHeight: 1.5, color: "var(--fg)",
          }}
        />
      </div>
    </ModalShell>
  );
}

export const usage = `import { StripePayment } from "@/components/agent-ui/stripe-payment";

<StripePayment
  intent={{
    kind: "refund",
    amountCents: 4900,
    currency: "USD",
    customer: { name, email },
    description: "Duplicate charge from May invoice",
    paymentMethod: { brand: "visa", last4: "4242" },
    invoice: invoiceId,
    livemode: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      stripe.refunds.create({
        amount: r.payload.amountCents,
        charge: chargeId,
        reason: "duplicate",
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "StripeIntent",                            req: true,  desc: "Kind, amount, currency, customer, description, payment method, invoice, livemode." },
  { name: "onResult", type: "(r: ReviewResult<StripePayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.kind", type: "'charge' | 'refund' | 'transfer'",     req: true,  desc: "Refunds use a danger button; charges + transfers use the primary." },
];

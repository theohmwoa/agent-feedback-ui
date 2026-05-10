export const usage = `import { PayPalPayment } from "@/components/agent-ui/paypal-payment";

<PayPalPayment
  intent={agentDraft}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      // ship it
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "PayPalPaymentIntent", req: true,  desc: "Recipient, amount, currency, payment-type." },
  { name: "onResult", type: "(r: ReviewResult<PayPalPaymentPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
];

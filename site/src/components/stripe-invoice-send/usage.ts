export const usage = `import { StripeInvoiceSend } from "@/components/agent-ui/stripe-invoice-send";

<StripeInvoiceSend
  intent={{
    customer: { name: "Aria Kawai", email: "aria@orbitlabs.io" },
    invoiceNumber: "INV-1042",
    currency: "USD",
    lineItems: [
      { description: "Pro plan — May", quantity: 1, unitPriceCents: 49900 },
      { description: "Seats × 4",      quantity: 4, unitPriceCents: 1900 },
    ],
    taxRate: 0.0825,
    discountCents: 5000,
    dueDate: "2026-06-09",
    sendVia: "email",
    livemode: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      stripe.invoices.create({
        customer: customerId,
        collection_method: "send_invoice",
        days_until_due: 30,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "StripeInvoiceSendIntent",                              req: true,  desc: "Customer, invoice number, currency, line items, tax, discount, due date, livemode." },
  { name: "onResult", type: "(r: ReviewResult<StripeInvoiceSendPayload>) => void",  req: true,  desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.lineItems", type: "InvoiceLineItem[]",                            req: true,  desc: "Each is { description, quantity, unitPriceCents }. All editable inline." },
];

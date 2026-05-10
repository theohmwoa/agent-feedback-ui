import type { AgentMeta } from "../../types";

export type InvoiceLineItem = {
  description: string;
  quantity: number;
  unitPriceCents: number;
};

export type StripeInvoiceSendIntent = AgentMeta & {
  customer: { name: string; email: string };
  invoiceNumber: string;
  currency: string;
  lineItems: InvoiceLineItem[];
  taxRate?: number;
  discountCents?: number;
  dueDate: string;
  sendVia?: "email" | "link";
  livemode?: boolean;
};

export type StripeInvoiceSendPayload = {
  customerEmail: string;
  invoiceNumber: string;
  currency: string;
  lineItems: InvoiceLineItem[];
  taxRate: number;
  discountCents: number;
  dueDate: string;
  sendVia: "email" | "link";
  totalCents: number;
};

export const STRIPE_INVOICE_SEND_DEFAULT: StripeInvoiceSendIntent = {
  agent: "atlas",
  action: "send-invoice",
  customer: { name: "Aria Kawai", email: "aria@orbitlabs.io" },
  invoiceNumber: "INV-1042",
  currency: "USD",
  lineItems: [
    { description: "Pro plan — May 2026", quantity: 1, unitPriceCents: 49900 },
    { description: "Additional seats × 4", quantity: 4, unitPriceCents: 1900 },
    { description: "Custom domain setup",  quantity: 1, unitPriceCents: 7500 },
  ],
  taxRate: 0.0825,
  discountCents: 5000,
  dueDate: "2026-06-09",
  sendVia: "email",
  livemode: true,
  rationale: "Aria's plan renewed yesterday and 4 new seats were added on May 7. Invoice generated from the prorated billing cycle.",
};

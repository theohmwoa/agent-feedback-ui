import type { AgentMeta } from "../../types";

export type StripeKind = "charge" | "refund" | "transfer";

export type StripePaymentMethod = {
  brand: "visa" | "mastercard" | "amex" | "discover" | "ach";
  last4: string;
};

export type StripeIntent = AgentMeta & {
  kind: StripeKind;
  amountCents: number;
  currency: string;
  customer: { name: string; email: string };
  description: string;
  paymentMethod?: StripePaymentMethod;
  invoice?: string;
  livemode?: boolean;
};

export type StripePayload = {
  kind: StripeKind;
  amountCents: number;
  currency: string;
  customerEmail: string;
  description: string;
  invoice?: string;
};

export const STRIPE_DEFAULT: StripeIntent = {
  agent: "atlas",
  action: "issue-refund",
  kind: "refund",
  amountCents: 4900,
  currency: "USD",
  customer: { name: "Maya Okafor", email: "maya@nordlight.studio" },
  description: "Refund for the May invoice — duplicate charge from the failed retry.",
  paymentMethod: { brand: "visa", last4: "4242" },
  invoice: "in_1NXc8FH9",
  livemode: true,
  rationale: "The customer flagged a duplicate charge on May 6. Confirmed with the Stripe events log: payment_intent succeeded twice within 4 seconds.",
};

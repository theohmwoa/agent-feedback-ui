import type { AgentMeta } from "../../types";

export type PayPalPaymentType = "friends_family" | "goods_services";

export type PayPalFundingSource = {
  kind: "balance" | "bank" | "card";
  label: string;
  last4?: string;
};

export type PayPalIntent = AgentMeta & {
  recipient: { handle: string; name?: string };
  amountCents: number;
  currency: string;
  description: string;
  paymentType?: PayPalPaymentType;
  fundingSource?: PayPalFundingSource;
  livemode?: boolean;
};

export type PayPalPayload = {
  recipientHandle: string;
  amountCents: number;
  currency: string;
  description: string;
  paymentType: PayPalPaymentType;
  fundingSource: PayPalFundingSource;
};

export const PAYPAL_DEFAULT: PayPalIntent = {
  agent: "atlas",
  action: "send-payment",
  recipient: { handle: "marco@stratacraft.io", name: "Marco Belluci" },
  amountCents: 32400,
  currency: "USD",
  description: "May contracting — design system handoff (4h × $81)",
  paymentType: "goods_services",
  fundingSource: { kind: "bank", label: "Chase ••8124", last4: "8124" },
  livemode: true,
  rationale: "Marco's invoice came in on May 8 for 4 hours of design-system contracting. Pulled the line item from your contractor sheet.",
};

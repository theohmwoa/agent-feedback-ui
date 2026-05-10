import type { AgentMeta } from "../../types";

export type RefundLineItem = {
  sku: string;
  title: string;
  variant?: string;
  ordered: number;
  unitPriceCents: number;
  refundQty?: number;
  restock?: boolean;
};

export type RefundReason = "customer" | "damaged" | "fraud" | "inventory" | "other";

export type ShopifyRefundIntent = AgentMeta & {
  orderNumber: string;
  customer: { name: string; email: string };
  currency: string;
  lineItems: RefundLineItem[];
  shippingCents: number;
  refundShipping?: boolean;
  reason?: RefundReason;
  asStoreCredit?: boolean;
  livemode?: boolean;
};

export type ShopifyRefundPayload = {
  orderNumber: string;
  currency: string;
  lineItems: { sku: string; quantity: number; restock: boolean }[];
  refundShipping: boolean;
  amountCents: number;
  reason: RefundReason;
  asStoreCredit: boolean;
};

export const SHOPIFY_REFUND_DEFAULT: ShopifyRefundIntent = {
  agent: "atlas",
  action: "refund-order",
  orderNumber: "#1023",
  customer: { name: "Sasha Nguyen", email: "sasha@kindlin.app" },
  currency: "USD",
  lineItems: [
    { sku: "TEE-NIM-S",  title: "Nimbus tee",      variant: "Small · Slate",  ordered: 1, unitPriceCents: 4200, refundQty: 1, restock: true },
    { sku: "HAT-OAK-M",  title: "Oakridge cap",    variant: "Medium · Olive", ordered: 1, unitPriceCents: 3200, refundQty: 0, restock: false },
  ],
  shippingCents: 800,
  refundShipping: false,
  reason: "damaged",
  asStoreCredit: false,
  livemode: true,
  rationale: "Customer reported the tee arrived with a torn seam; replacement was already shipped, refunding only the tee (not the cap, not shipping).",
};

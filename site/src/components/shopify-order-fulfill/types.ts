import type { AgentMeta } from "../../types";

export type FulfillLineItem = {
  sku: string;
  title: string;
  variant?: string;
  ordered: number;
  fulfillQty?: number;
};

export type ShippingAddress = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type Carrier = "UPS" | "USPS" | "FedEx" | "DHL";

export type ShopifyOrderFulfillIntent = AgentMeta & {
  orderNumber: string;
  customer: { name: string; email: string };
  lineItems: FulfillLineItem[];
  shippingAddress: ShippingAddress;
  carrier?: Carrier;
  trackingNumber?: string;
  notifyCustomer?: boolean;
  livemode?: boolean;
};

export type ShopifyOrderFulfillPayload = {
  orderNumber: string;
  lineItems: { sku: string; quantity: number }[];
  carrier: Carrier;
  trackingNumber: string;
  notifyCustomer: boolean;
};

export const SHOPIFY_ORDER_FULFILL_DEFAULT: ShopifyOrderFulfillIntent = {
  agent: "atlas",
  action: "fulfill-order",
  orderNumber: "#1041",
  customer: { name: "Lina Brennan", email: "lina@bldrhouse.com" },
  lineItems: [
    { sku: "TEE-NIM-M",  title: "Nimbus tee",      variant: "Medium · Slate",  ordered: 2 },
    { sku: "HAT-OAK-L",  title: "Oakridge cap",    variant: "Large · Olive",   ordered: 1 },
    { sku: "BAG-ATL-OS", title: "Atlas weekender", variant: "One size · Tan",  ordered: 1 },
  ],
  shippingAddress: {
    name: "Lina Brennan",
    line1: "1138 NW Glisan St",
    line2: "Apt 304",
    city: "Portland",
    state: "OR",
    postalCode: "97209",
    country: "US",
  },
  carrier: "UPS",
  trackingNumber: "1Z999AA10123456784",
  notifyCustomer: true,
  livemode: true,
  rationale: "Three line items dropped from the warehouse this morning — wrapping fulfillment so the SLA deadline (24h) doesn't slip.",
};

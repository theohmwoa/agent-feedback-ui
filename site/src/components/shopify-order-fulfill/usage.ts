export const usage = `import { ShopifyOrderFulfill } from "@/components/agent-ui/shopify-order-fulfill";

<ShopifyOrderFulfill
  intent={{
    orderNumber: "#1041",
    customer: { name, email },
    lineItems: order.line_items.map(li => ({
      sku: li.sku, title: li.title, variant: li.variant_title, ordered: li.quantity,
    })),
    shippingAddress: order.shipping_address,
    carrier: "UPS",
    trackingNumber: tracking,
    notifyCustomer: true,
    livemode: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      shopify.fulfillment.create({
        order_id: orderId,
        line_items: r.payload.lineItems,
        tracking_company: r.payload.carrier,
        tracking_number: r.payload.trackingNumber,
        notify_customer: r.payload.notifyCustomer,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "ShopifyOrderFulfillIntent",                            req: true,  desc: "Order number, customer, line items (with ordered qty cap), address, carrier, tracking." },
  { name: "onResult", type: "(r: ReviewResult<ShopifyOrderFulfillPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.lineItems", type: "FulfillLineItem[]",                            req: true,  desc: "Each has ordered qty as the upper bound; default fulfill qty equals ordered." },
];

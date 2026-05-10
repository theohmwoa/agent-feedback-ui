export const usage = `import { ShopifyRefund } from "@/components/agent-ui/shopify-refund";

<ShopifyRefund
  intent={{
    orderNumber: "#1023",
    customer: { name, email },
    currency: "USD",
    lineItems: order.line_items.map(li => ({
      sku: li.sku, title: li.title, ordered: li.quantity,
      unitPriceCents: Math.round(li.price * 100),
      refundQty: 0, restock: false,
    })),
    shippingCents: Math.round(order.shipping_lines[0].price * 100),
    reason: "damaged",
    livemode: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      shopify.refund.create({
        order_id: orderId,
        refund_line_items: r.payload.lineItems,
        shipping: { full_refund: r.payload.refundShipping },
        amount: r.payload.amountCents / 100,
        note: r.payload.reason,
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "ShopifyRefundIntent",                            req: true,  desc: "Order, customer, line items, shipping, reason, store credit toggle." },
  { name: "onResult", type: "(r: ReviewResult<ShopifyRefundPayload>) => void", req: true,  desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.lineItems", type: "RefundLineItem[]",                       req: true,  desc: "Each item carries an `ordered` cap; refundQty defaults to 0." },
];

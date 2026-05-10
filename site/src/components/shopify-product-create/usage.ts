export const usage = `import { ShopifyProductCreate } from "@/components/agent-ui/shopify-product-create";

<ShopifyProductCreate
  intent={{
    title: "Atlas weekender bag",
    description: longDescription,
    imageUrl: cdnUrl,
    priceCents: 18900,
    compareAtCents: 22500,
    currency: "USD",
    inventoryTracked: true,
    inventoryQty: 42,
    weightGrams: 1240,
    requiresShipping: true,
    status: "Draft",
    tags: ["bags", "weekender"],
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      shopify.product.create({
        title: r.payload.title,
        body_html: r.payload.description,
        variants: [{
          price: (r.payload.priceCents / 100).toFixed(2),
          compare_at_price: r.payload.compareAtCents
            ? (r.payload.compareAtCents / 100).toFixed(2) : null,
          inventory_quantity: r.payload.inventoryQty,
          weight: (r.payload.weightGrams ?? 0) / 1000,
        }],
        status: r.payload.status.toLowerCase(),
        tags: r.payload.tags.join(", "),
      });
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "ShopifyProductCreateIntent",                            req: true,  desc: "Title, body, image, pricing (compare-at), inventory, shipping, SEO, status, tags." },
  { name: "onResult", type: "(r: ReviewResult<ShopifyProductCreatePayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.status", type: "'Active' | 'Draft' | 'Archived'",                  req: false, desc: "Storefront visibility." },
];

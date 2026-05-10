import type { AgentMeta } from "../../types";

export type ProductStatus = "Active" | "Draft" | "Archived";

export type ShopifyProductCreateIntent = AgentMeta & {
  title: string;
  description: string;
  imageUrl?: string;
  priceCents: number;
  compareAtCents?: number;
  currency: string;
  inventoryTracked?: boolean;
  inventoryQty?: number;
  weightGrams?: number;
  requiresShipping?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  status?: ProductStatus;
  tags?: string[];
};

export type ShopifyProductCreatePayload = {
  title: string;
  description: string;
  imageUrl?: string;
  priceCents: number;
  compareAtCents?: number;
  currency: string;
  inventoryTracked: boolean;
  inventoryQty?: number;
  weightGrams?: number;
  requiresShipping: boolean;
  seoTitle?: string;
  seoDescription?: string;
  status: ProductStatus;
  tags: string[];
};

export const SHOPIFY_PRODUCT_CREATE_DEFAULT: ShopifyProductCreateIntent = {
  agent: "atlas",
  action: "create-product",
  title: "Atlas weekender bag",
  description: "Waxed canvas weekender with bridle leather handles, brass YKK zip, and a felt-lined laptop sleeve. Cut and sewn in Portland.",
  imageUrl: "https://placehold.co/600x400",
  priceCents: 18900,
  compareAtCents: 22500,
  currency: "USD",
  inventoryTracked: true,
  inventoryQty: 42,
  weightGrams: 1240,
  requiresShipping: true,
  seoTitle: "Atlas weekender bag — waxed canvas, bridle leather",
  seoDescription: "A 48L waxed-canvas weekender with leather handles, brass zip, and a felt-lined laptop sleeve. Made in Portland, Oregon.",
  status: "Draft",
  tags: ["bags", "weekender", "made-in-pdx"],
  rationale: "Drafted from the spec doc + the photographer's product brief. Image placeholder until the cutout assets are uploaded.",
};

import type { AgentMeta } from "../../types";

export type GraphQLOperation = "query" | "mutation" | "subscription";

export type GraphQLHeader = { key: string; value: string };

export type GraphQLIntent = AgentMeta & {
  endpoint: string;
  operation: GraphQLOperation;
  operationName?: string;
  query: string;
  variables?: string;
  headers?: GraphQLHeader[];
  expectedShape?: string;
  affectsProduction?: boolean;
};

export type GraphQLPayload = {
  endpoint: string;
  operation: GraphQLOperation;
  operationName?: string;
  query: string;
  variables?: string;
  headers: GraphQLHeader[];
};

export const GRAPHQL_DEFAULT: GraphQLIntent = {
  agent: "atlas",
  action: "graphql-query",
  endpoint: "https://api.shopify.com/admin/api/2024-10/graphql.json",
  operation: "mutation",
  operationName: "ProductUpdatePrice",
  query: `mutation ProductUpdatePrice($id: ID!, $price: Money!) {
  productVariantUpdate(input: { id: $id, price: $price }) {
    productVariant {
      id
      price
      updatedAt
    }
    userErrors {
      field
      message
    }
  }
}`,
  variables: `{
  "id": "gid://shopify/ProductVariant/4471284596",
  "price": "29.99"
}`,
  headers: [
    { key: "X-Shopify-Access-Token", value: "shpat_<redacted>" },
    { key: "Content-Type",           value: "application/json" },
  ],
  expectedShape: `{
  data: {
    productVariantUpdate: {
      productVariant: { id, price, updatedAt },
      userErrors: []
    }
  }
}`,
  affectsProduction: true,
  rationale: "Bumping the price on the holiday SKU per the merchandising sheet you signed off on this morning.",
};

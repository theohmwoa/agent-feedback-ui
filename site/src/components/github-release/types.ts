import type { AgentMeta } from "../../types";

export type ReleaseAsset = {
  name: string;
  size: string;     // human readable, e.g. "4.2 MB"
  contentType?: string;
};

export type ReleaseIntent = AgentMeta & {
  repo: string;
  previousTag: string;
  suggestedTag: string;
  title: string;
  notes: string;
  targetCommitish?: string;
  prerelease?: boolean;
  latest?: boolean;
  draft?: boolean;
  assets?: ReleaseAsset[];
};

export type ReleasePayload = {
  repo: string;
  tag: string;
  title: string;
  notes: string;
  prerelease: boolean;
  latest: boolean;
  draft: boolean;
};

export const RELEASE_DEFAULT: ReleaseIntent = {
  agent: "atlas",
  action: "cut-release",
  repo: "northwind/orders-svc",
  previousTag: "v3.7.4",
  suggestedTag: "v3.8.0",
  title: "v3.8.0 — Fulfillment partner SDK + retry-aware webhooks",
  targetCommitish: "main",
  prerelease: false,
  latest: true,
  draft: false,
  notes: `## Highlights
- Add the FulfillmentPartner SDK with adapters for Shipbob, ShipHero, and Flexport
- Webhooks now retry with exponential backoff (max 7 attempts, 4h horizon)
- /v1/orders search picks up status filters across multi-warehouse inventory

## Bug fixes
- Carrier rate cache no longer serves stale rates after a tariff change
- Order cancel correctly releases inventory holds in Postgres serializable txns

## Breaking changes
None. \`POST /v1/orders\` still accepts the legacy \`shipping_method\` enum, but \`shipping_profile\` is preferred.

## Contributors
@maya.okafor · @rafael.silva · @ji.park · @lin.huang
`,
  assets: [
    { name: "orders-svc-darwin-arm64.tar.gz", size: "12.4 MB" },
    { name: "orders-svc-linux-amd64.tar.gz",  size: "11.9 MB" },
    { name: "orders-svc-linux-arm64.tar.gz",  size: "11.6 MB" },
    { name: "orders-svc.sbom.spdx.json",      size: "184 KB"  },
    { name: "orders-svc.sig",                 size: "256 B"   },
  ],
  rationale: "Bumped to a minor: new FulfillmentPartner public surface but no breaking changes since v3.7.4.",
};

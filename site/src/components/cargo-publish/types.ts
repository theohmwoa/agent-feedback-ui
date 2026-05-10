import type { AgentMeta } from "../../types";

export type CargoDep = {
  name: string;
  version: string;
  kind: "normal" | "dev" | "build";
};

export type CargoIntent = AgentMeta & {
  crateName: string;
  currentVersion: string;
  nextVersion: string;
  manifest: {
    license?: string;
    description?: string;
    repository?: string;
    homepage?: string;
    keywords?: string[];
    categories?: string[];
    rustVersion?: string;
  };
  bundledFiles: number;
  bundledSize: string;
  dependencies: CargoDep[];
  yankPrevious?: boolean;
  registry?: string;
};

export type CargoPayload = {
  crateName: string;
  version: string;
  yankPrevious: boolean;
};

export const CARGO_DEFAULT: CargoIntent = {
  agent: "atlas",
  action: "publish-crate",
  crateName: "northwind_router",
  currentVersion: "0.6.2",
  nextVersion: "0.7.0",
  manifest: {
    license: "Apache-2.0",
    description: "Geo-aware HTTP router with origin failover and tariff-aware caching.",
    repository: "https://github.com/northwind/router-rs",
    homepage: "https://docs.northwind.dev/router",
    keywords: ["http", "routing", "edge", "geo", "cdn"],
    categories: ["network-programming", "web-programming::http-server"],
    rustVersion: "1.76",
  },
  bundledFiles: 47,
  bundledSize: "284 KB",
  dependencies: [
    { name: "tokio",       version: "1.40",  kind: "normal" },
    { name: "hyper",       version: "1.4",   kind: "normal" },
    { name: "serde",       version: "1.0",   kind: "normal" },
    { name: "tracing",     version: "0.1",   kind: "normal" },
    { name: "thiserror",   version: "2.0",   kind: "normal" },
    { name: "tower",       version: "0.5",   kind: "normal" },
    { name: "criterion",   version: "0.5",   kind: "dev" },
    { name: "wiremock",    version: "0.6",   kind: "dev" },
  ],
  yankPrevious: false,
  registry: "crates.io",
  rationale: "Bumping minor: GeoRoutingMiddleware is a new public type; nothing removed since 0.6.2.",
};

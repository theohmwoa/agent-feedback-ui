import type { AgentMeta } from "../../types";

export type SemverBump = "patch" | "minor" | "major" | "prerelease";

export type TarballFile = {
  path: string;
  size: string;     // human readable
};

export type NpmIntent = AgentMeta & {
  packageName: string;
  currentVersion: string;
  bump?: SemverBump;
  tag?: "latest" | "beta" | "next" | "alpha" | "canary";
  registry?: string;
  files: TarballFile[];
  totalSize: string;
  totalUnpacked: string;
  npmDistTags?: { latest?: string; beta?: string; next?: string };
  twoFactor?: boolean;
};

export type NpmPayload = {
  packageName: string;
  version: string;
  tag: string;
  dryRun: boolean;
};

export const NPM_DEFAULT: NpmIntent = {
  agent: "atlas",
  action: "publish-package",
  packageName: "@northwind/billing-sdk",
  currentVersion: "1.4.7",
  bump: "minor",
  tag: "latest",
  registry: "https://registry.npmjs.org/",
  files: [
    { path: "package.json",        size: "2.1 KB" },
    { path: "README.md",           size: "12.8 KB" },
    { path: "LICENSE",             size: "1.0 KB" },
    { path: "dist/index.js",       size: "184 KB" },
    { path: "dist/index.mjs",      size: "182 KB" },
    { path: "dist/index.d.ts",     size: "32 KB" },
    { path: "dist/types/payments.d.ts",   size: "18 KB" },
    { path: "dist/types/customers.d.ts",  size: "14 KB" },
  ],
  totalSize: "98 KB (gzip)",
  totalUnpacked: "446 KB",
  npmDistTags: {
    latest: "1.4.7",
    beta:   "1.5.0-beta.3",
    next:   "2.0.0-rc.1",
  },
  twoFactor: true,
  rationale: "Bumped to 1.5.0 — adds the FulfillmentPartner SDK surface (additive, no removed exports). 'minor' matches your repo's release script.",
};

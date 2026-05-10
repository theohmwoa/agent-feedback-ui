export const usage = `import { CargoPublish } from "@/components/agent-ui/cargo-publish";

<CargoPublish
  intent={{
    crateName: "northwind_router",
    currentVersion: "0.6.2",
    nextVersion: "0.7.0",
    manifest: {
      license: "Apache-2.0",
      description: crateDescription,
      repository: "https://github.com/northwind/router-rs",
      keywords: ["http", "routing", "edge"],
      rustVersion: "1.76",
    },
    bundledFiles: 47,
    bundledSize: "284 KB",
    dependencies: deps,        // [{ name, version, kind: "normal" | "dev" | "build" }]
    yankPrevious: false,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      execSync(\`cargo publish --token \${process.env.CARGO_TOKEN}\`);
      if (r.payload.yankPrevious) execSync(\`cargo yank --version \${prevVersion}\`);
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "CargoIntent",                            req: true,  desc: "Crate name, current/next version, manifest fields, bundled count + size, dependency tree." },
  { name: "onResult", type: "(r: ReviewResult<CargoPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.dependencies", type: "CargoDep[]",                  req: true,  desc: "Each { name, version, kind: 'normal' | 'dev' | 'build' }; grouped in the side panel." },
];

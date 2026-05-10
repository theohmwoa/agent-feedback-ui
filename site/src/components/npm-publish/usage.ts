export const usage = `import { NpmPublish } from "@/components/agent-ui/npm-publish";

<NpmPublish
  intent={{
    packageName: "@northwind/billing-sdk",
    currentVersion: "1.4.7",
    bump: "minor",
    tag: "latest",
    files: tarballFiles,         // [{ path, size }]
    totalSize: "98 KB (gzip)",
    totalUnpacked: "446 KB",
    npmDistTags: { latest: "1.4.7", beta: "1.5.0-beta.3" },
    twoFactor: true,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      execSync(\`npm version \${r.payload.version} --no-git-tag-version\`);
      execSync(\`npm publish --tag \${r.payload.tag} \${r.payload.dryRun ? "--dry-run" : ""}\`);
    }
  }}
/>`;

export const props = [
  { name: "intent",   type: "NpmIntent",                            req: true,  desc: "Package, current version, suggested bump, tag, registry, tarball file list, totals." },
  { name: "onResult", type: "(r: ReviewResult<NpmPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'. payload includes the resolved version + dryRun flag." },
  { name: "intent.bump", type: "'patch' | 'minor' | 'major' | 'prerelease'", req: false, desc: "Pre-selected bump. Switching the picker recomputes the next version." },
];

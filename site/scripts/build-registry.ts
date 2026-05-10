// Walks src/components/ and emits a flat JSON registry into public/registry/.
// Each component becomes one .json file containing the source bytes for the
// CLI to write into the user's project. Three "system" entries (primitives,
// icons, types-base) ship the shared UI dependencies.
//
// Run via: npm run build:registry  (or as part of npm run build).

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC = join(ROOT, "src");
const OUT = join(ROOT, "public", "registry");

mkdirSync(OUT, { recursive: true });

type RegistryEntry = {
  name: string;
  type: "component" | "system";
  title?: string;
  summary?: string;
  category?: string;
  files: Array<{ path: string; content: string }>;
  registryDependencies: string[];
  npmDependencies: string[];
  agentUiVersion: string;
};

const VERSION = "0.1.0";

// Read a meta.ts file to extract the component's title / summary / category.
// Cheap regex parse — these files all follow the same shape.
function readMeta(slug: string) {
  const metaPath = join(SRC, "components", slug, "meta.ts");
  const src = readFileSync(metaPath, "utf8");
  const title    = (src.match(/title:\s*["']([^"']+)["']/)    || [])[1] || slug;
  const summary  = (src.match(/summary:\s*["']([^"']+)["']/)  || [])[1] || "";
  const category = (src.match(/category:\s*["']([^"']+)["']/) || [])[1] || "misc";
  return { title, summary, category };
}

const COMPONENTS = readdirSync(join(SRC, "components"))
  .filter(name => statSync(join(SRC, "components", name)).isDirectory())
  .sort();

// ----- component entries -----
for (const slug of COMPONENTS) {
  const dir = join(SRC, "components", slug);
  const files: Array<{ path: string; content: string }> = [];
  for (const f of readdirSync(dir)) {
    if (f === "meta.ts" || f === "usage.ts") continue;
    files.push({
      path: `${slug}/${f}`,
      content: readFileSync(join(dir, f), "utf8"),
    });
  }
  const meta = readMeta(slug);
  const entry: RegistryEntry = {
    name: slug,
    type: "component",
    title: meta.title,
    summary: meta.summary,
    category: meta.category,
    files,
    registryDependencies: ["primitives", "icons", "types-base"],
    npmDependencies: ["react"],
    agentUiVersion: VERSION,
  };
  writeFileSync(join(OUT, `${slug}.json`), JSON.stringify(entry, null, 2) + "\n");
}

// ----- system entries (shared dependencies) -----

const sysFiles: Record<string, { src: string; out: string }> = {
  primitives: { src: "chrome/primitives.tsx", out: "primitives.tsx" },
  icons:      { src: "chrome/icons.tsx",      out: "icons.tsx" },
  "types-base": { src: "types.ts",            out: "types.ts" },
};

for (const [name, def] of Object.entries(sysFiles)) {
  const content = readFileSync(join(SRC, def.src), "utf8");
  const entry: RegistryEntry = {
    name,
    type: "system",
    files: [{ path: def.out, content }],
    registryDependencies: name === "primitives" ? ["icons"] : [],
    npmDependencies: ["react"],
    agentUiVersion: VERSION,
  };
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify(entry, null, 2) + "\n");
}

// ----- index -----

const index = {
  agentUiVersion: VERSION,
  components: COMPONENTS.map(slug => {
    const m = readMeta(slug);
    return { name: slug, title: m.title, summary: m.summary, category: m.category };
  }),
  system: Object.keys(sysFiles),
};
writeFileSync(join(OUT, "index.json"), JSON.stringify(index, null, 2) + "\n");

console.log(`registry: wrote ${COMPONENTS.length} components + ${Object.keys(sysFiles).length} system entries → ${OUT}`);

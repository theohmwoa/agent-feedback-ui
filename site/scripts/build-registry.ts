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

// ----- meta inlined here so we don't have to eval TS at build-time. -----
// Keep in sync with src/components/*/meta.ts.
const COMPONENT_META: Record<string, { title: string; summary: string; category: string }> = {
  "email-compose":      { title: "Email compose",      summary: "Review and edit an email before the agent sends it.",                          category: "messaging" },
  "slack-message":      { title: "Slack message",      summary: "Reply in a thread or post to a channel.",                                       category: "messaging" },
  "linear-issue":       { title: "Linear issue",       summary: "Triage-shaped issue creation.",                                                 category: "issue-tracker" },
  "github-pr-review":   { title: "GitHub PR review",   summary: "Approve, comment, or request changes on a PR.",                                 category: "code" },
  "file-patch-preview": { title: "File patch preview", summary: "Inline diff with per-hunk approve/reject.",                                     category: "code" },
  "shell-command":      { title: "Shell command",      summary: "Approve a shell command before the agent runs it.",                             category: "code" },
  "sql-query-runner":   { title: "SQL query runner",   summary: "Approve a query before it hits prod.",                                          category: "data" },
  "calendar-event":     { title: "Calendar event",     summary: "Confirm a meeting before it's scheduled.",                                      category: "calendar" },
  "github-issue":       { title: "GitHub issue",       summary: "File a GitHub issue with title, body, labels, assignees, and milestone.",       category: "issue-tracker" },
  "notion-page":        { title: "Notion page",        summary: "Approve a page write to Notion.",                                               category: "docs" },
  "http-request":       { title: "HTTP request",       summary: "Approve an HTTP call before the agent fires it.",                               category: "integration" },
  "stripe-payment":     { title: "Stripe payment",     summary: "Authorize a charge, refund, or transfer.",                                      category: "payments" },
  "sms-message":        { title: "SMS message",        summary: "Approve a text message.",                                                       category: "messaging" },
};

const COMPONENTS = Object.keys(COMPONENT_META);

// ----- component entries -----
for (const slug of COMPONENTS) {
  const dir = join(SRC, "components", slug);
  if (!statSync(dir).isDirectory()) continue;

  const files: Array<{ path: string; content: string }> = [];
  for (const f of readdirSync(dir)) {
    if (f === "meta.ts" || f === "usage.ts") continue;
    files.push({
      path: `${slug}/${f}`,
      content: readFileSync(join(dir, f), "utf8"),
    });
  }

  const meta = COMPONENT_META[slug]!;
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
  components: COMPONENTS.map(slug => ({
    name: slug,
    title: COMPONENT_META[slug]!.title,
    summary: COMPONENT_META[slug]!.summary,
    category: COMPONENT_META[slug]!.category,
  })),
  system: Object.keys(sysFiles),
};
writeFileSync(join(OUT, "index.json"), JSON.stringify(index, null, 2) + "\n");

console.log(`registry: wrote ${COMPONENTS.length} components + ${Object.keys(sysFiles).length} system entries → ${OUT}`);

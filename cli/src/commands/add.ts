import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import prompts from "prompts";
import { requireConfig } from "../util/config";
import { resolveDeps, type RegistryEntry } from "../util/registry";
import { rewriteImports } from "../util/rewrite";
import { log, c } from "../util/log";

export async function addCommand({
  names, yes, overwrite,
}: {
  names: string[];
  yes?: boolean;
  overwrite?: boolean;
}) {
  if (names.length === 0) {
    log.err("usage: agent-ui add <name> [<name>...]");
    process.exit(1);
  }

  const cfg = requireConfig();
  const targetRoot = resolve(process.cwd(), cfg.componentPath);
  const importPrefix = cfg.importAlias ?? cfg.componentPath;

  log.step(`Resolving ${names.length} component${names.length === 1 ? "" : "s"} from ${cfg.registry}`);

  let resolved: RegistryEntry[];
  try {
    resolved = await resolveDeps(cfg.registry, names);
  } catch (e) {
    log.err((e as Error).message);
    process.exit(1);
  }

  const components = resolved.filter(r => r.type === "component");
  const system     = resolved.filter(r => r.type === "system");

  log.empty();
  if (system.length > 0) {
    log.info(`will install ${c.gray(system.length + " shared file" + (system.length === 1 ? "" : "s"))}: ${system.map(s => c.cyan(s.name)).join(", ")}`);
  }
  log.info(`will install ${c.gray(components.length + " component" + (components.length === 1 ? "" : "s"))}: ${components.map(s => c.cyan(s.name)).join(", ")}`);
  log.info(`target: ${c.cyan(targetRoot)}`);
  log.empty();

  // Detect conflicts
  const conflicts: string[] = [];
  for (const entry of resolved) {
    for (const file of entry.files) {
      const dst = join(targetRoot, file.path);
      if (existsSync(dst)) {
        const existing = readFileSync(dst, "utf8");
        const incoming = rewriteImports(file.content, file.path, importPrefix);
        if (existing !== incoming) conflicts.push(file.path);
      }
    }
  }

  if (conflicts.length > 0 && !overwrite) {
    log.warn(`${conflicts.length} file${conflicts.length === 1 ? " exists" : "s exist"} and would change:`);
    for (const f of conflicts.slice(0, 6)) log.raw(`    ${c.yellow(f)}`);
    if (conflicts.length > 6) log.raw(`    ${c.gray(`(+${conflicts.length - 6} more)`)}`);
    if (!yes) {
      const { proceed } = await prompts({
        type: "confirm",
        name: "proceed",
        message: "Overwrite all conflicts?",
        initial: false,
      });
      if (!proceed) {
        log.warn("install cancelled");
        return;
      }
    } else {
      log.err("--yes given without --overwrite; refusing to clobber existing files");
      process.exit(1);
    }
  }

  // Write
  let written = 0;
  let skipped = 0;
  for (const entry of resolved) {
    for (const file of entry.files) {
      const dst = join(targetRoot, file.path);
      const incoming = rewriteImports(file.content, file.path, importPrefix);
      if (existsSync(dst)) {
        const existing = readFileSync(dst, "utf8");
        if (existing === incoming) { skipped++; continue; }
      }
      mkdirSync(dirname(dst), { recursive: true });
      writeFileSync(dst, incoming);
      written++;
    }
  }

  log.empty();
  log.ok(`wrote ${c.bold(String(written))} file${written === 1 ? "" : "s"}` + (skipped ? ` · skipped ${skipped} unchanged` : ""));
  log.empty();

  // npm deps reminder
  const allNpm = new Set<string>();
  for (const e of resolved) for (const d of e.npmDependencies) allNpm.add(d);
  allNpm.delete("react"); // assumed
  if (allNpm.size > 0) {
    log.info(`don't forget to install: ${c.cyan(`npm install ${[...allNpm].join(" ")}`)}`);
  }

  // Usage hint
  if (components.length > 0) {
    const sample = components[0]!;
    log.raw(`Next: import { ${capitalize(camelize(sample.name))} } from ${c.gray(`"${importPrefix}/${sample.name}"`)}`);
  }
}

function camelize(s: string) {
  return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

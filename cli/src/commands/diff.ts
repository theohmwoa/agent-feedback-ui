import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { requireConfig } from "../util/config";
import { fetchEntry } from "../util/registry";
import { rewriteImports } from "../util/rewrite";
import { log, c } from "../util/log";

export async function diffCommand({ name }: { name: string }) {
  const cfg = requireConfig();
  const targetRoot = resolve(process.cwd(), cfg.componentPath);
  const importPrefix = cfg.importAlias ?? cfg.componentPath;

  const entry = await fetchEntry(cfg.registry, name);
  log.step(`Diff ${c.cyan(name)} · local vs registry`);
  log.empty();

  let diffs = 0;
  for (const file of entry.files) {
    const dst = join(targetRoot, file.path);
    if (!existsSync(dst)) {
      log.warn(`${file.path} — not installed`);
      diffs++;
      continue;
    }
    const local = readFileSync(dst, "utf8");
    const remote = rewriteImports(file.content, file.path, importPrefix);
    if (local === remote) {
      log.ok(`${file.path} — matches registry`);
    } else {
      log.warn(`${file.path} — diverged from registry`);
      // Print line counts for a quick signal
      log.raw(c.gray(`    local: ${local.split("\n").length} lines · registry: ${remote.split("\n").length} lines`));
      diffs++;
    }
  }
  log.empty();
  if (diffs === 0) log.ok("up to date");
  else log.info(`${diffs} file${diffs === 1 ? "" : "s"} differ. Run \`agent-ui add ${name} --overwrite\` to update.`);
}

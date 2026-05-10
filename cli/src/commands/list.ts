import { fetchIndex } from "../util/registry";
import { loadConfig, DEFAULT_REGISTRY } from "../util/config";
import { log, c } from "../util/log";

export async function listCommand() {
  const cfg = loadConfig();
  const registry = cfg?.registry ?? DEFAULT_REGISTRY;
  log.step(`Catalog from ${registry}`);
  log.empty();

  let index;
  try {
    index = await fetchIndex(registry);
  } catch (e) {
    log.err((e as Error).message);
    process.exit(1);
  }

  // Group by category
  const byCat = new Map<string, typeof index.components>();
  for (const c0 of index.components) {
    const cat = c0.category ?? "uncategorized";
    if (!byCat.has(cat)) byCat.set(cat, []);
    byCat.get(cat)!.push(c0);
  }

  const cats = [...byCat.keys()].sort();
  for (const cat of cats) {
    log.raw(c.gray(cat + "/"));
    for (const cc of byCat.get(cat)!) {
      const cmd = c.cyan(cc.name.padEnd(22));
      log.raw(`  ${cmd}  ${c.dim(cc.summary)}`);
    }
    log.empty();
  }

  log.info(`${index.components.length} components · agent-ui v${index.agentUiVersion}`);
  log.raw(`Install: ${c.bold("agent-ui add <name>")}`);
}

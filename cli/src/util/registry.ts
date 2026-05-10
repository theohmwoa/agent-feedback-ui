// Talks to the public registry. Each entry is one fetch.

export type RegistryFile = {
  path: string;
  content: string;
};

export type RegistryEntry = {
  name: string;
  type: "component" | "system";
  title?: string;
  summary?: string;
  category?: string;
  files: RegistryFile[];
  registryDependencies: string[];
  npmDependencies: string[];
  agentUiVersion: string;
};

export type RegistryIndex = {
  agentUiVersion: string;
  components: Array<{ name: string; title: string; summary: string; category?: string }>;
  system: string[];
};

export async function fetchEntry(registry: string, name: string): Promise<RegistryEntry> {
  const url = `${registry.replace(/\/$/, "")}/${encodeURIComponent(name)}.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Component "${name}" not found in registry (HTTP ${res.status} from ${url})`);
  }
  return (await res.json()) as RegistryEntry;
}

export async function fetchIndex(registry: string): Promise<RegistryIndex> {
  const url = `${registry.replace(/\/$/, "")}/index.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Registry index unreachable (HTTP ${res.status} from ${url})`);
  }
  return (await res.json()) as RegistryIndex;
}

// Walk the registryDependencies graph. Returns a topologically-sorted
// list (deps before dependents) with no duplicates.
export async function resolveDeps(
  registry: string,
  rootNames: string[],
): Promise<RegistryEntry[]> {
  const visited = new Map<string, RegistryEntry>();
  const order: string[] = [];

  async function visit(name: string) {
    if (visited.has(name)) return;
    const entry = await fetchEntry(registry, name);
    visited.set(name, entry);
    for (const dep of entry.registryDependencies) {
      await visit(dep);
    }
    order.push(name);
  }

  for (const n of rootNames) await visit(n);
  // `order` already has deps-before-dependents because we push after recursion.
  return order.map(n => visited.get(n)!);
}

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const CONFIG_FILE = "agent-ui.json";

export type AgentUiConfig = {
  $schema?: string;
  registry: string;        // e.g. "https://theohmwoa.github.io/agent-feedback-ui/registry"
  componentPath: string;   // e.g. "components/agent-ui"
  importAlias?: string;    // e.g. "@/components/agent-ui"  — used when rewriting imports
};

export const DEFAULT_REGISTRY = "https://theohmwoa.github.io/agent-feedback-ui/registry";

export function configPath(cwd = process.cwd()) {
  return resolve(cwd, CONFIG_FILE);
}

export function loadConfig(cwd = process.cwd()): AgentUiConfig | null {
  const p = configPath(cwd);
  if (!existsSync(p)) return null;
  try {
    const json = JSON.parse(readFileSync(p, "utf8"));
    return json as AgentUiConfig;
  } catch (e) {
    throw new Error(`Failed to parse ${CONFIG_FILE}: ${(e as Error).message}`);
  }
}

export function saveConfig(cfg: AgentUiConfig, cwd = process.cwd()) {
  const p = configPath(cwd);
  writeFileSync(p, JSON.stringify(cfg, null, 2) + "\n");
}

export function requireConfig(cwd = process.cwd()): AgentUiConfig {
  const cfg = loadConfig(cwd);
  if (!cfg) {
    throw new Error(
      `No ${CONFIG_FILE} found in ${cwd}.\n` +
      `Run \`agent-ui init\` first.`,
    );
  }
  return cfg;
}

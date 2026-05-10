import { existsSync } from "node:fs";
import prompts from "prompts";
import { configPath, saveConfig, DEFAULT_REGISTRY, type AgentUiConfig } from "../util/config";
import { log, c } from "../util/log";

export async function initCommand({ yes }: { yes?: boolean }) {
  const cwd = process.cwd();
  const cfgPath = configPath(cwd);

  if (existsSync(cfgPath) && !yes) {
    const { overwrite } = await prompts({
      type: "confirm",
      name: "overwrite",
      message: "agent-ui.json already exists. Overwrite?",
      initial: false,
    });
    if (!overwrite) {
      log.warn("init cancelled");
      return;
    }
  }

  const defaults = {
    componentPath: "components/agent-ui",
    importAlias: "@/components/agent-ui",
  };

  let answers = defaults;
  if (!yes) {
    const a = await prompts([
      {
        type: "text",
        name: "componentPath",
        message: "Where should components land?",
        initial: defaults.componentPath,
      },
      {
        type: "text",
        name: "importAlias",
        message: "Import alias (used when rewriting imports in copied source)",
        initial: defaults.importAlias,
      },
    ]);
    if (!a.componentPath) {
      log.warn("init cancelled");
      return;
    }
    answers = { componentPath: a.componentPath, importAlias: a.importAlias };
  }

  const cfg: AgentUiConfig = {
    $schema: "https://theohmwoa.github.io/agent-feedback-ui/schema/agent-ui.json",
    registry: DEFAULT_REGISTRY,
    componentPath: answers.componentPath,
    importAlias: answers.importAlias,
  };
  saveConfig(cfg, cwd);

  log.empty();
  log.ok(`wrote ${c.cyan("agent-ui.json")}`);
  log.info(`components will land in ${c.cyan(answers.componentPath)}`);
  log.info(`import alias: ${c.cyan(answers.importAlias)}`);
  log.empty();
  log.raw(`Next: ${c.bold("agent-ui add email-compose")}`);
}

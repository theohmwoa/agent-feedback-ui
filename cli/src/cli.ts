// agent-ui — CLI entry. Parses argv into one of: init, add, list, diff.
// Avoids commander to keep the dependency footprint minimal.

import { initCommand } from "./commands/init";
import { addCommand }  from "./commands/add";
import { listCommand } from "./commands/list";
import { diffCommand } from "./commands/diff";
import { log, c } from "./util/log";

const VERSION = "0.1.0";

const HELP = `
${c.bold("agent-ui")} ${c.gray("v" + VERSION)}
A copy-paste registry of review-and-edit components for AI agent surfaces.

${c.gray("Usage:")}
  agent-ui ${c.cyan("init")}                        Set up agent-ui.json
  agent-ui ${c.cyan("add")} <name> [<name>...]      Copy components into your project
  agent-ui ${c.cyan("list")}                        Show available components
  agent-ui ${c.cyan("diff")} <name>                 See what changed since you copied it

${c.gray("Flags:")}
  -y, --yes        Accept defaults / skip prompts
  --overwrite      Replace existing files (with --yes)
  -h, --help       Show this help
  -v, --version    Show version

${c.gray("Docs:")}  ${c.cyan("https://theohmwoa.github.io/agent-feedback-ui/")}
`;

type ParsedArgs = {
  cmd: string | null;
  positional: string[];
  flags: Record<string, boolean | string>;
};

function parse(argv: string[]): ParsedArgs {
  const args = argv.slice(2);
  let cmd: string | null = null;
  const positional: string[] = [];
  const flags: Record<string, boolean | string> = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i]!;
    if (a.startsWith("--")) {
      const eq = a.indexOf("=");
      if (eq !== -1) flags[a.slice(2, eq)] = a.slice(eq + 1);
      else flags[a.slice(2)] = true;
    } else if (a.startsWith("-") && a.length > 1) {
      for (const ch of a.slice(1)) {
        if (ch === "y") flags.yes = true;
        else if (ch === "h") flags.help = true;
        else if (ch === "v") flags.version = true;
      }
    } else if (cmd === null) {
      cmd = a;
    } else {
      positional.push(a);
    }
  }
  return { cmd, positional, flags };
}

async function main() {
  const { cmd, positional, flags } = parse(process.argv);

  if (flags.help && !cmd) {
    console.log(HELP);
    return;
  }
  if (flags.version) {
    console.log(VERSION);
    return;
  }

  try {
    switch (cmd) {
      case undefined:
      case null:
        console.log(HELP);
        return;

      case "init":
        await initCommand({ yes: !!flags.yes });
        return;

      case "add":
        await addCommand({
          names: positional,
          yes: !!flags.yes,
          overwrite: !!flags.overwrite,
        });
        return;

      case "list":
      case "ls":
        await listCommand();
        return;

      case "diff":
        if (!positional[0]) {
          log.err("usage: agent-ui diff <name>");
          process.exit(1);
        }
        await diffCommand({ name: positional[0] });
        return;

      default:
        log.err(`unknown command: ${cmd}`);
        console.log(HELP);
        process.exit(1);
    }
  } catch (e) {
    log.err((e as Error).message);
    process.exit(1);
  }
}

main();

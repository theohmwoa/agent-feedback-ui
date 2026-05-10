# agent-ui

> Copy-paste components for the moment your AI agent asks "send it?"

[![npm](https://img.shields.io/npm/v/agent-ui.svg)](https://www.npmjs.com/package/agent-ui)

A CLI for the [agent-ui catalog](https://theohmwoa.github.io/agent-feedback-ui/) — a registry of review-and-edit React components for AI agent action surfaces. Modeled on shadcn: the source lands in your repo, you own it from there.

## Install

```bash
npx agent-ui init                              # set up agent-ui.json
npx agent-ui add email-compose slack-message   # write the source into your repo
```

## Commands

| Command | What it does |
|---|---|
| `agent-ui init` | Writes `agent-ui.json` with paths + the registry URL |
| `agent-ui add <name>...` | Fetches components (and their shared deps) from the registry and writes them into `componentPath` |
| `agent-ui list` | Show the catalog grouped by category |
| `agent-ui diff <name>` | Compare a locally-installed component against the registry |

## Flags

| Flag | What it does |
|---|---|
| `-y`, `--yes` | Accept defaults / skip prompts |
| `--overwrite` | Replace existing files (with `--yes`) |
| `-h`, `--help` | Show help |
| `-v`, `--version` | Show version |

## Config (`agent-ui.json`)

```json
{
  "registry": "https://theohmwoa.github.io/agent-feedback-ui/registry",
  "componentPath": "components/agent-ui",
  "importAlias": "@/components/agent-ui"
}
```

The CLI rewrites imports in copied source so they resolve against `importAlias`. If you don't have `@/*` set up in `tsconfig.json`, set `importAlias` to a relative-friendly path or wire up a path alias.

## How it works

Each component in the catalog ships as a JSON manifest at the registry URL — the CLI fetches `<registry>/<name>.json`, walks its `registryDependencies` (shared primitives, icons, types), writes the source files into your `componentPath`, and rewrites import paths to use your alias.

## License

MIT — see [LICENSE](../LICENSE).

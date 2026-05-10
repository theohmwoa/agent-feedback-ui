export const usage = `import { ShellCommand } from "@/components/agent-ui/shell-command";

<ShellCommand
  intent={{
    command: agentDraft,
    cwd: process.cwd(),
    shell: "zsh",
    expectedEffect: "Renames REQUEST_ID to X-Trace-Id across ~24 files.",
    dryRun: filesToTouch,
    risk: "caution",
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      execSync(r.payload.command, { cwd: r.payload.cwd });
    }
  }}
/>`;

export const props = [
  { name: "intent",         type: "ShellIntent",                            req: true,  desc: "Command, cwd, shell, expectedEffect, dryRun list, risk." },
  { name: "onResult",       type: "(r: ReviewResult<ShellPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "intent.risk",    type: "'safe' | 'caution' | 'danger'",          req: false, desc: "Drives the badge color and the run-button variant." },
];

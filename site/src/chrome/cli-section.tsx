import React from "react";
import { Icon } from "./icons";
import { Pill, SectionHeader } from "./primitives";

const cmds = [
  { c: "npx agent-ui init", n: "set up agent-ui.json, paths, theme tokens" },
  { c: "npx agent-ui add email-compose slack-message", n: "fetch & write source into your repo" },
  { c: "npx agent-ui list", n: "show the registry" },
  { c: "npx agent-ui diff email-compose", n: "see what changed since you copied it" },
];

export function CliSection() {
  return (
    <section id="cli" style={{ padding: "80px 0", borderBottom: "1px solid var(--border)" }}>
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 64, alignItems: "start" }}>
          <div>
            <SectionHeader
              eyebrow="cli/"
              title="One CLI. Four verbs. Done."
              subtitle="Modeled on shadcn — the source you copy is the source you ship. Diff against the registry whenever you want to see drift."
            />
            <div style={{ marginTop: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Pill tone="accent" size="md">init</Pill>
              <Pill tone="accent" size="md">add</Pill>
              <Pill tone="accent" size="md">list</Pill>
              <Pill tone="accent" size="md">diff</Pill>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cmds.map(c => (
              <div key={c.c} style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "12px 16px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)", borderRadius: 10,
              }}>
                <Icon.ChevronRight size={14} style={{ color: "var(--fg-faint)", flexShrink: 0 }} />
                <code style={{
                  fontFamily: "var(--font-mono)", fontSize: 13.5,
                  color: "var(--fg)",
                  whiteSpace: "nowrap", overflow: "hidden",
                  textOverflow: "ellipsis", flexShrink: 0,
                }}>{c.c}</code>
                <span style={{ color: "var(--fg-faint)" }}>—</span>
                <span style={{ fontSize: 13, color: "var(--fg-muted)" }}>{c.n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

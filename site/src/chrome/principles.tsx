import React from "react";
import { SectionHeader } from "./primitives";

const items = [
  {
    kbd: "01",
    title: "No runtime, no provider.",
    body: "Every component is a pure (intent → result) function. Wire it up to whatever agent SDK you already use — AI SDK, Mastra, LangChain, your own.",
  },
  {
    kbd: "02",
    title: "Copy, don't install.",
    body: "Source lands in your repo with one command. Restyle, refactor, fork — no upstream breakage. The CLI is the only npm dependency.",
  },
  {
    kbd: "03",
    title: "Domain-shaped, not branded.",
    body: "Each component looks like the surface it's reviewing without copying any platform's chrome. CSS variables for accent and radius, dark and light out of the box.",
  },
  {
    kbd: "04",
    title: "ARIA-correct by default.",
    body: "Focus traps, escape-to-cancel, role=dialog, keyboard parity with mouse on every action. A screen reader can drive the whole thing.",
  },
];

export function Principles() {
  return (
    <section id="principles" style={{ padding: "80px 0", borderBottom: "1px solid var(--border)" }}>
      <div className="wrap">
        <SectionHeader
          eyebrow="principles/"
          title="What's in the box, and what isn't."
        />
        <div style={{
          marginTop: 36,
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 1,
          background: "var(--border)",
          border: "1px solid var(--border)",
          borderRadius: 12, overflow: "hidden",
        }}>
          {items.map(it => (
            <div key={it.kbd} style={{
              padding: "26px 28px",
              background: "var(--bg-card)",
              minHeight: 180,
            }}>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                color: "var(--fg-faint)", marginBottom: 10,
              }}>{it.kbd}</div>
              <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.3, marginBottom: 8 }}>
                {it.title}
              </div>
              <div style={{ fontSize: 14, color: "var(--fg-muted)", lineHeight: 1.55, maxWidth: 460 }}>
                {it.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

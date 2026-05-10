import React from "react";
import { Icon } from "./icons";
import { Button, Kbd } from "./primitives";
import { REPO_URL } from "./constants";
import { EmailCompose } from "../components/email-compose";
import { ResultToast } from "./result-toast";

const HERO_LINES = [
  { kind: "prompt" as const, text: "npx agent-ui add email-compose" },
  { kind: "out"    as const, text: "✔ Resolved registry → components/agent-ui/" },
  { kind: "out"    as const, text: "✔ Wrote email-compose/index.tsx (412 LOC)" },
  { kind: "out"    as const, text: "✔ Wrote email-compose/types.ts" },
  { kind: "out"    as const, text: "✔ Installed peer deps: lucide-react, framer-motion" },
  { kind: "ok"     as const, text: "ready · import { EmailCompose } from \"@/components/agent-ui/email-compose\"" },
];

export function Hero({
  onBrowse, onOpenPalette,
}: {
  onBrowse: () => void;
  onOpenPalette: () => void;
}) {
  const [step, setStep] = React.useState(0);
  const [typed, setTyped] = React.useState("");
  const cmd = HERO_LINES[0]!.text;

  React.useEffect(() => {
    if (step !== 0) return;
    if (typed.length < cmd.length) {
      const t = setTimeout(() => setTyped(cmd.slice(0, typed.length + 1)), 38);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep(1), 350);
    return () => clearTimeout(t);
  }, [typed, step, cmd]);

  React.useEffect(() => {
    if (step === 0) return;
    if (step >= HERO_LINES.length) return;
    const delays = [0, 240, 360, 380, 520, 360];
    const t = setTimeout(() => setStep(s => s + 1), delays[step] || 320);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <section style={{
      paddingTop: 72, paddingBottom: 80,
      borderBottom: "1px solid var(--border)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(to right, color-mix(in oklch, var(--fg) 4%, transparent) 1px, transparent 1px), " +
          "linear-gradient(to bottom, color-mix(in oklch, var(--fg) 4%, transparent) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        maskImage: "radial-gradient(ellipse 70% 70% at 50% 30%, black 30%, transparent 80%)",
        pointerEvents: "none",
      }} />

      <div className="wrap" style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            height: 24, padding: "0 10px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)", borderRadius: 999,
            fontSize: 11.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-muted)",
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: 999,
              background: "var(--agent-ui-accent)",
              animation: "pulse-ring 1.6s ease-out infinite",
            }} />
            v0.1 · public preview · MIT
          </span>
        </div>

        <h1 style={{
          fontSize: 78, lineHeight: 0.98, letterSpacing: -2.5,
          fontWeight: 600, margin: 0, maxWidth: 980,
          textWrap: "pretty" as const,
        }}>
          Beautiful UI{" "}
          <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 400, letterSpacing: -1 }}>
            for the moment
          </span>{" "}
          your agent asks{" "}
          <span style={{
            background: "linear-gradient(180deg, transparent 60%, color-mix(in oklch, var(--agent-ui-accent) 40%, transparent) 60%)",
            padding: "0 4px",
          }}>
            "send it?"
          </span>
        </h1>

        <p style={{
          marginTop: 22, maxWidth: 640,
          fontSize: 18, lineHeight: 1.5,
          color: "var(--fg-muted)",
          textWrap: "pretty" as const,
        }}>
          A copy-paste registry of review-and-edit components for AI agent surfaces — emails, messages, issues, queries, patches. No runtime, no provider, no protocol.{" "}
          <span style={{ color: "var(--fg)" }}>Just components you own.</span>
        </p>

        <div style={{ marginTop: 28, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Button variant="primary" size="lg" iconRight={<Icon.ArrowRight size={15} />} onClick={onBrowse}>
            Browse components
          </Button>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <Button variant="default" size="lg" icon={<Icon.GitHub size={15} />}>
              agent-ui on GitHub
            </Button>
          </a>
          <button
            onClick={onOpenPalette}
            aria-label="Open command palette"
            style={{
              marginLeft: 8, fontSize: 12.5, fontFamily: "var(--font-mono)",
              color: "var(--fg-faint)",
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "transparent", border: 0, cursor: "pointer",
            }}
          >
            <Kbd>⌘</Kbd> <Kbd>K</Kbd> &nbsp;to search
          </button>
        </div>

        <div style={{
          marginTop: 64,
          display: "grid",
          gridTemplateColumns: "minmax(0, 460px) 1fr",
          gap: 32, alignItems: "start",
        }}>
          <Terminal lines={HERO_LINES} step={step} typed={typed} />

          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", top: -10, left: 24,
              fontSize: 10.5, fontFamily: "var(--font-mono)",
              color: "var(--fg-faint)",
              padding: "0 6px", background: "var(--bg)",
              letterSpacing: 0.4, textTransform: "uppercase",
            }}>
              live · interact with it
            </div>
            <div style={{
              border: "1px dashed var(--border-strong)",
              borderRadius: 14, padding: 24,
              background: "color-mix(in oklch, var(--bg-elev) 60%, transparent)",
              opacity: step >= 5 ? 1 : 0.4,
              transition: "opacity .5s ease",
              filter: step >= 5 ? "none" : "blur(4px)",
            }}>
              <HeroEmail />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Terminal({
  lines, step, typed,
}: {
  lines: typeof HERO_LINES; step: number; typed: string;
}) {
  return (
    <div style={{
      background: "var(--code-bg)",
      border: "1px solid var(--border)",
      borderRadius: 12, overflow: "hidden",
      fontFamily: "var(--font-mono)",
      boxShadow: "0 18px 40px -16px rgb(0 0 0 / .55)",
    }}>
      <div style={{
        display: "flex", alignItems: "center",
        padding: "10px 14px",
        borderBottom: "1px solid var(--border-faint)",
        gap: 8,
      }}>
        <span style={{ width: 10, height: 10, borderRadius: 999, background: "oklch(0.5 0.02 80)" }} />
        <span style={{ width: 10, height: 10, borderRadius: 999, background: "oklch(0.5 0.02 80)" }} />
        <span style={{ width: 10, height: 10, borderRadius: 999, background: "oklch(0.5 0.02 80)" }} />
        <span style={{ marginLeft: 12, fontSize: 11, color: "var(--fg-faint)" }}>
          ~/nordlight-app
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10.5, color: "var(--fg-faint)" }}>zsh</span>
      </div>
      <div style={{ padding: "16px 18px", fontSize: 13.5, lineHeight: 1.65, minHeight: 240 }}>
        {lines.map((ln, i) => {
          const visible = i < step || (i === 0 && typed.length > 0);
          if (!visible) return null;
          const text = i === 0 ? typed : ln.text;
          const showCursor = i === 0 && step === 0;
          return (
            <div key={i} style={{ display: "flex", gap: 8, animation: i > 0 ? "rise-in .25s ease" : "none" }}>
              {ln.kind === "prompt" && <span style={{ color: "var(--agent-ui-accent)" }}>›</span>}
              {ln.kind === "out"    && <span style={{ color: "var(--c-ok)", width: 14, flexShrink: 0 }}>✓</span>}
              {ln.kind === "ok"     && <span style={{ color: "var(--agent-ui-accent)", width: 14, flexShrink: 0 }}>★</span>}
              <span style={{
                color: ln.kind === "prompt" ? "var(--fg)"
                  : ln.kind === "ok" ? "var(--fg)"
                  : "var(--fg-muted)",
                whiteSpace: "pre-wrap", wordBreak: "break-word",
              }}>
                {text}
                {showCursor && (
                  <span style={{
                    display: "inline-block",
                    width: 7, height: 14,
                    background: "var(--agent-ui-accent)",
                    marginLeft: 2,
                    verticalAlign: "text-bottom",
                    animation: "blink 1s step-start infinite",
                  }} />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HeroEmail() {
  const [result, setResult] = React.useState<unknown>(null);
  return (
    <div style={{ animation: "rise-in .6s cubic-bezier(.2,.9,.2,1)" }}>
      <EmailCompose onResult={setResult} />
      <ResultToast result={result} onDismiss={() => setResult(null)} />
    </div>
  );
}

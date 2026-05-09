/**
 * App composition + top-level state (theme, strategy, scenario,
 * comparison-card lock, toast stack, "play all four" sequencer).
 *
 * The actual library calls (applyFeedback, EmailModal types) live in
 * playground.tsx. This file is just plumbing.
 */

import { useEffect, useRef, useState } from "react";
import { Comparison } from "./comparison.js";
import { CodeSection } from "./code-block.js";
import {
  STRATEGIES,
  SCENARIOS,
  type Scenario,
  type StrategyKind,
  type StrategyMeta,
} from "./data.js";
import { Hero } from "./hero.js";
import { Icon } from "./icons.js";
import { Playground } from "./playground.js";

interface Toast {
  id: string;
  msg: string;
}

interface SimulatorHandle {
  triggerAgent: () => void;
  programmaticRun: (sId: StrategyKind) => void;
}

export function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [strategy, setStrategy] = useState<StrategyMeta>(STRATEGIES[0]!);
  const [scenario, setScenario] = useState<Scenario>(SCENARIOS.email!);
  const [locked, setLocked] = useState<StrategyKind | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [playingAll, setPlayingAll] = useState(false);
  const simRef = useRef<SimulatorHandle | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const pushToast = (msg: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((ts) => [...ts, { id, msg }]);
    setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 1600);
  };

  // Keyboard shortcuts: 1/2/3/4 -> strategy, Enter -> trigger.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key >= "1" && e.key <= "4") {
        const idx = parseInt(e.key, 10) - 1;
        const next = STRATEGIES[idx];
        if (next) {
          setStrategy(next);
          pushToast(`Strategy ${next.num} · ${next.name}`);
        }
      }
      if (e.key === "Enter") {
        simRef.current?.triggerAgent();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const playAllFour = async () => {
    if (playingAll) return;
    setPlayingAll(true);
    pushToast("Playing all four strategies…");
    for (const s of STRATEGIES) {
      setStrategy(s);
      await new Promise((r) => setTimeout(r, 150));
      simRef.current?.programmaticRun(s.id);
      await new Promise((r) => setTimeout(r, 1500));
    }
    setPlayingAll(false);
    pushToast("Done · pick one to drill in");
  };

  const scrollToPlayground = () => {
    document
      .getElementById("playground")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-brand">
          <span className="logo" />
          <span className="nav-brand-name">agent-feedback-ui</span>
          <span className="nav-version">v0.0.1</span>
        </div>
        <div className="nav-links">
          <a className="nav-link" href="#playground">Playground</a>
          <a className="nav-link" href="#comparison">Strategies</a>
          <a className="nav-link" href="#code">Code</a>
          <button
            className="icon-btn"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            aria-label="Toggle theme"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={15} />
          </button>
          <a
            className="icon-btn"
            href="https://github.com/theohmwoa/agent-feedback-ui"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <Icon name="github" size={16} />
          </a>
        </div>
      </nav>

      <Hero onTryIt={scrollToPlayground} />

      <Playground
        strategy={strategy}
        setStrategy={setStrategy}
        scenario={scenario}
        setScenario={setScenario}
        registerSimulator={(sim) => {
          simRef.current = sim;
        }}
      />

      <section className="section" style={{ paddingTop: 16 }}>
        <div
          className="section-inner"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <button className="btn" onClick={playAllFour} disabled={playingAll}>
            <Icon name="playall" size={13} />
            {playingAll ? "playing…" : "Play all four"}
          </button>
        </div>
      </section>

      <Comparison
        scenario={scenario}
        locked={locked}
        setLocked={setLocked}
      />

      <CodeSection />

      <footer className="footer">
        <div className="footer-inner">
          <div className="fcopy">© 2026 · agent-feedback-ui · MIT</div>
          <div className="flinks">
            <a
              href="https://github.com/theohmwoa/agent-feedback-ui"
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="github" size={13} /> GitHub
            </a>
            <a
              href="https://github.com/theohmwoa/agent-feedback-ui/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="scale" size={13} /> MIT
            </a>
          </div>
        </div>
      </footer>

      <div className="toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div className="toast" key={t.id}>
            <span className="tdot" />
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

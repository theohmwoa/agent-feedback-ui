import { useEffect, useState } from "react";
import { Icon } from "./icons.js";

function HeroDiagram() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPhase((p) => (p + 1) % 4), 1600);
    return () => clearInterval(t);
  }, []);

  const nodes = [
    { id: 0, x: 80, y: 80, label: "agent draft", sub: "message" },
    { id: 1, x: 320, y: 80, label: "human edit", sub: "modal" },
    { id: 2, x: 320, y: 320, label: "strategy reshape", sub: "feedback" },
    { id: 3, x: 80, y: 320, label: "agent continues", sub: "next step" },
  ];

  const path = "M 120 80 H 320 V 320 H 120 V 80";

  return (
    <div className="hero-diagram">
      <svg viewBox="0 0 400 400" aria-hidden="true">
        <defs>
          <linearGradient id="grad-flow" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.0" />
            <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {[60, 120, 180].map((r, i) => (
          <circle
            key={r}
            cx="200"
            cy="200"
            r={r}
            fill="none"
            stroke="var(--border-soft)"
            strokeDasharray="2 6"
            opacity={0.6 - i * 0.15}
          />
        ))}

        <path d={path} fill="none" stroke="var(--border-strong)" strokeWidth="1.5" />

        <path
          d={path}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeDasharray="100 700"
          style={{
            strokeDashoffset: -phase * 200,
            transition: "stroke-dashoffset 1.4s cubic-bezier(0.5, 0, 0.2, 1)",
            filter: "drop-shadow(0 0 6px var(--accent-glow))",
          }}
        />

        {nodes.map((n) => {
          const active = n.id === phase;
          return (
            <g key={n.id} transform={`translate(${n.x},${n.y})`}>
              {active && (
                <circle r="34" fill="var(--accent-glow)" filter="url(#glow)">
                  <animate
                    attributeName="r"
                    from="22"
                    to="40"
                    dur="1.4s"
                    repeatCount="1"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.6"
                    to="0"
                    dur="1.4s"
                    repeatCount="1"
                  />
                </circle>
              )}
              <circle
                r="22"
                fill="var(--bg-elev)"
                stroke={active ? "var(--accent)" : "var(--border-strong)"}
                strokeWidth={active ? 2 : 1}
                style={{ transition: "all 300ms ease-out" }}
              />
              <circle
                r="6"
                fill={active ? "var(--accent)" : "var(--fg-faint)"}
                style={{ transition: "fill 300ms ease-out" }}
              />
              <text
                x={n.x < 200 ? -34 : 34}
                y="4"
                textAnchor={n.x < 200 ? "end" : "start"}
                fontFamily="var(--font-mono)"
                fontSize="11"
                fill={active ? "var(--fg)" : "var(--fg-muted)"}
                style={{ transition: "fill 300ms ease-out" }}
              >
                {n.label}
              </text>
              <text
                x={n.x < 200 ? -34 : 34}
                y="20"
                textAnchor={n.x < 200 ? "end" : "start"}
                fontFamily="var(--font-mono)"
                fontSize="9"
                fill="var(--fg-faint)"
              >
                {n.sub}
              </text>
            </g>
          );
        })}

        {[
          { x: 200, y: 80, rot: 0 },
          { x: 320, y: 200, rot: 90 },
          { x: 200, y: 320, rot: 180 },
          { x: 80, y: 200, rot: 270 },
        ].map((a, i) => (
          <g key={i} transform={`translate(${a.x},${a.y}) rotate(${a.rot})`}>
            <path d="M -4 -4 L 4 0 L -4 4 Z" fill="var(--fg-faint)" />
          </g>
        ))}

        <g transform="translate(200,200)">
          <text
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="10"
            fill="var(--fg-dim)"
            letterSpacing="2"
            y="-6"
          >
            FEEDBACK
          </text>
          <text
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="10"
            fill="var(--fg-dim)"
            letterSpacing="2"
            y="8"
          >
            STRATEGY
          </text>
          <text
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="22"
            fontWeight="600"
            fill="var(--accent)"
            y="34"
          >
            {phase + 1}/4
          </text>
        </g>
      </svg>
    </div>
  );
}

interface HeroProps {
  onTryIt: () => void;
}

export function Hero({ onTryIt }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-grid" />
      <div className="hero-inner">
        <div>
          <div className="hero-eyebrow">
            <span className="pip" />
            <span>v0.0.1 · MIT · TypeScript · backed by real applyFeedback</span>
          </div>
          <h1>
            Intercept the agent. <em>Reshape the loop.</em>
          </h1>
          <p className="hero-pitch">
            <span className="mono" style={{ color: "var(--fg)" }}>
              agent-feedback-ui
            </span>{" "}
            hands the user a domain-shaped modal at the moment the agent is
            about to act — and gives you four interchangeable strategies for
            what happens next.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={onTryIt}>
              <Icon name="play" size={13} />
              Try the playground
              <span className="kbd">↵</span>
            </button>
            <a
              className="btn"
              href="https://github.com/theohmwoa/agent-feedback-ui"
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="github" size={14} />
              GitHub
            </a>
          </div>
        </div>
        <HeroDiagram />
      </div>
    </section>
  );
}

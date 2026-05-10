import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Icon } from "../chrome/icons";
import {
  Button, CopyButton, Dot, IconButton, InstallCommand, Pill,
} from "../chrome/primitives";
import { CodeBlock } from "../chrome/code-block";
import { ResultToast } from "../chrome/result-toast";
import { findStable, STABLE, type PropRow, type RegistryEntry } from "../registry";
import { useToast } from "../hooks/use-toast";

type Tab = "preview" | "code" | "props";

export function ComponentPage() {
  const { slug } = useParams<{ slug: string }>();
  const c = slug ? findStable(slug) : undefined;
  if (!c) return <Navigate to="/" replace />;

  const [tab, setTab] = React.useState<Tab>("preview");
  const [result, setResult] = React.useState<unknown>(null);
  const { toast, show } = useToast();

  const Comp = c.Component!;

  const onShare = () => {
    const url = window.location.href;
    try { navigator.clipboard?.writeText(url); } catch { /* no-op */ }
    show({ msg: "Copied share link", value: url });
  };

  // "Up next" — pick four sibling components. Prefer one from the same
  // category, fill the rest randomly. Re-rolled per slug change so each
  // page lands on a fresh mix; this scales to a 1k+ catalog.
  const others = React.useMemo(() => {
    const pool = STABLE.filter(o => o.id !== c.id);
    const sameCat = pool.filter(o => o.category && o.category === c.category);
    const otherCat = pool.filter(o => !o.category || o.category !== c.category);
    const shuffled = (arr: typeof pool) => [...arr].sort(() => Math.random() - 0.5);
    const picks: typeof pool = [];
    const fromSame = shuffled(sameCat).slice(0, 1);
    picks.push(...fromSame);
    for (const x of shuffled(otherCat)) {
      if (picks.length >= 4) break;
      picks.push(x);
    }
    // Fallback: if we still don't have 4, fill from same-category leftovers.
    for (const x of shuffled(sameCat)) {
      if (picks.length >= 4) break;
      if (!picks.includes(x)) picks.push(x);
    }
    return picks;
  }, [c.id, c.category]);

  return (
    <>
      <div style={{ background: "var(--bg)" }}>
        <div className="wrap" style={{ padding: "24px 0 0" }}>
          <Breadcrumb title={c.title} />
        </div>

        <header style={{
          padding: "20px 0 32px",
          borderBottom: "1px solid var(--border)",
        }}>
          <div className="wrap" style={{
            display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap",
          }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                marginBottom: 14,
                padding: "4px 10px",
                border: "1px solid var(--border)", borderRadius: 999,
                fontFamily: "var(--font-mono)", fontSize: 11.5,
                color: "var(--fg-muted)",
              }}>
                <Dot color={c.accent} />
                {c.name}
                {c.loc && (
                  <>
                    <span style={{ color: "var(--fg-faint)" }}>·</span>
                    <span style={{ color: "var(--fg-faint)" }}>{c.loc} LOC</span>
                  </>
                )}
                <button
                  onClick={onShare}
                  aria-label={`Copy share link for ${c.title}`}
                  style={{
                    marginLeft: 4, padding: "0 4px",
                    display: "inline-flex", alignItems: "center", gap: 4,
                    background: "transparent", border: 0, cursor: "pointer",
                    color: "var(--fg-faint)", font: "inherit",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = "var(--fg)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "var(--fg-faint)"; }}
                >
                  <Icon.Share size={11} />
                  <span>share</span>
                </button>
              </div>
              <h1 style={{
                margin: 0, fontSize: 44, fontWeight: 600,
                letterSpacing: -1, lineHeight: 1.05,
              }}>{c.title}</h1>
              <p style={{
                marginTop: 12, maxWidth: 580,
                fontSize: 16, lineHeight: 1.55,
                color: "var(--fg-muted)",
              }}>{c.summary}</p>
            </div>
            <InstallCommand name={c.name} style={{ minWidth: 360, maxWidth: 460 }} />
          </div>
        </header>

        {/* Tabs */}
        <div className="wrap" style={{ paddingTop: 28 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: 4,
            background: "var(--bg-inset)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            width: "fit-content",
          }}>
            {[
              { id: "preview", label: "Preview" },
              { id: "code",    label: "Usage" },
              { id: "props",   label: "Props" },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as Tab)}
                style={{
                  height: 28, padding: "0 12px",
                  fontSize: 12.5, fontWeight: 500,
                  color: tab === t.id ? "var(--fg)" : "var(--fg-muted)",
                  background: tab === t.id ? "var(--bg-card)" : "transparent",
                  borderRadius: 7,
                  border: tab === t.id ? "1px solid var(--border)" : "1px solid transparent",
                }}
              >{t.label}</button>
            ))}
          </div>

          <div style={{ marginTop: 16, minHeight: 480 }}>
            {tab === "preview" && <PreviewStage Comp={Comp} setResult={setResult} accent={c.accent} />}
            {tab === "code"    && c.usage && <CodeBlock code={c.usage} />}
            {tab === "props"   && c.props && <PropsTable rows={c.props} />}
          </div>
        </div>

        {/* Up next — a sample, not the catalog */}
        <section style={{ padding: "60px 0 80px" }}>
          <div className="wrap">
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              marginBottom: 22,
            }}>
              <div>
                <div style={{
                  fontFamily: "var(--font-mono)", fontSize: 11.5,
                  color: "var(--fg-faint)", letterSpacing: 0.4,
                  marginBottom: 8,
                }}>up next/</div>
                <h3 style={{
                  margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: -0.4,
                }}>You might also need</h3>
              </div>
              <div style={{ flex: 1 }} />
              <Link
                to="/?s=browser"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 13, color: "var(--fg-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                Browse all {STABLE.length}
                <Icon.ArrowRight size={13} />
              </Link>
            </div>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12,
            }}>
              {others.map(o => (
                <Link
                  key={o.id}
                  to={`/c/${o.id}`}
                  style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "18px 20px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    textDecoration: "none", color: "inherit",
                  }}
                >
                  <Dot color={o.accent} size={8} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{o.title}</div>
                    <div style={{
                      fontSize: 12.5, color: "var(--fg-muted)",
                      marginTop: 2,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>{o.summary}</div>
                  </div>
                  <Icon.ArrowRight size={14} style={{ color: "var(--fg-faint)" }} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>

      <ResultToast result={result} onDismiss={() => setResult(null)} />

      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed", left: "50%", bottom: 28, transform: "translateX(-50%)",
            zIndex: 1100,
            padding: "10px 14px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-strong)",
            borderRadius: 999,
            display: "inline-flex", alignItems: "center", gap: 8,
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: "var(--fg)",
            boxShadow: "0 12px 32px -10px rgb(0 0 0 / .5)",
            animation: "rise-in .25s ease",
          }}
        >
          <Icon.Check size={13} style={{ color: "var(--agent-ui-accent)" }} />
          <span>{toast.msg}</span>
        </div>
      )}
    </>
  );
}

function Breadcrumb({ title }: { title: string }) {
  return (
    <nav aria-label="Breadcrumb" style={{
      display: "flex", alignItems: "center", gap: 6,
      fontSize: 12.5, fontFamily: "var(--font-mono)",
      color: "var(--fg-faint)",
    }}>
      <Link to="/" style={{ color: "var(--fg-muted)", display: "inline-flex", alignItems: "center", gap: 4 }}>
        <Icon.ArrowLeft size={12} />
        agent-ui
      </Link>
      <span>·</span>
      <Link to="/?s=browser" style={{ color: "var(--fg-muted)" }}>components</Link>
      <span>·</span>
      <span style={{ color: "var(--fg)" }}>{title}</span>
    </nav>
  );
}

function PreviewStage({
  Comp, setResult, accent,
}: {
  Comp: NonNullable<RegistryEntry["Component"]>;
  setResult: (r: unknown) => void;
  accent: string;
}) {
  return (
    <div style={{
      position: "relative",
      padding: "56px 24px",
      background: "var(--bg-inset)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      display: "flex", justifyContent: "center", alignItems: "flex-start",
      backgroundImage:
        "radial-gradient(circle at 20% 0%, color-mix(in oklch, " + accent + " 18%, transparent), transparent 60%), " +
        "radial-gradient(circle at 80% 100%, color-mix(in oklch, var(--agent-ui-accent) 8%, transparent), transparent 60%)",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, color-mix(in oklch, var(--fg) 8%, transparent) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 90%)",
        pointerEvents: "none",
      }} />
      <div style={{ position: "relative" }}>
        <Comp onResult={setResult} />
      </div>
    </div>
  );
}

function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      overflow: "hidden",
      fontFamily: "var(--font-sans)",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "180px 280px 1fr 80px",
        padding: "12px 16px",
        background: "var(--bg-inset)",
        borderBottom: "1px solid var(--border)",
        fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6,
        color: "var(--fg-faint)", fontWeight: 500,
      }}>
        <div>Prop</div><div>Type</div><div>Description</div><div>Required</div>
      </div>
      {rows.map((r, i) => (
        <div key={r.name} style={{
          display: "grid",
          gridTemplateColumns: "180px 280px 1fr 80px",
          padding: "12px 16px",
          borderTop: i === 0 ? 0 : "1px solid var(--border-faint)",
          fontSize: 13.5,
          alignItems: "start",
        }}>
          <div style={{ fontFamily: "var(--font-mono)", color: "var(--fg)" }}>{r.name}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--c-linear)" }}>{r.type}</div>
          <div style={{ color: "var(--fg-muted)", lineHeight: 1.55 }}>{r.desc}</div>
          <div>{r.req
            ? <Pill tone="accent" size="xs">required</Pill>
            : <Pill size="xs">optional</Pill>}</div>
        </div>
      ))}
    </div>
  );
}

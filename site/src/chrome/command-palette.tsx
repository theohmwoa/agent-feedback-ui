import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./icons";
import { Dot, Kbd, Pill } from "./primitives";
import { REGISTRY } from "../registry";
import { REPO_URL } from "./constants";

type ItemKind = "component" | "section" | "action";
type Item = {
  kind: ItemKind;
  id: string;
  name: string;
  desc?: string;
  stable?: boolean;
  accent?: string;
  slug?: string;
};

function buildItems(): Item[] {
  const items: Item[] = [];
  for (const c of REGISTRY) {
    items.push({
      kind: "component",
      id: c.id,
      name: c.title,
      slug: c.name,
      desc: c.summary,
      stable: c.status === "stable",
      accent: c.accent,
    });
  }
  items.push(
    { kind: "section", id: "browser",    name: "Browse all components", desc: "Component grid" },
    { kind: "section", id: "cli",        name: "CLI",                   desc: "Install commands" },
    { kind: "section", id: "principles", name: "Principles",            desc: "What's in the box" },
  );
  items.push(
    { kind: "action", id: "github",       name: "Open GitHub repo",     desc: "theohmwoa/agent-feedback-ui" },
    { kind: "action", id: "copy-install", name: "Copy install command", desc: "npx agent-ui add …" },
    { kind: "action", id: "theme-toggle", name: "Toggle theme",         desc: "Switch dark / light" },
  );
  return items;
}

export function CommandPalette({
  open, onClose, onTheme, onCopy,
}: {
  open: boolean;
  onClose: () => void;
  onTheme: () => void;
  onCopy: (msg: string, value?: string) => void;
}) {
  const navigate = useNavigate();
  const [q, setQ] = React.useState("");
  const [sel, setSel] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const items = React.useMemo(buildItems, []);
  const filtered = React.useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return items;
    return items
      .map(it => {
        const hay = (it.name + " " + (it.slug ?? "") + " " + (it.desc ?? "") + " " + it.id).toLowerCase();
        const idx = hay.indexOf(qq);
        return idx === -1 ? null : { it, idx };
      })
      .filter((x): x is { it: Item; idx: number } => x !== null)
      .sort((a, b) => a.idx - b.idx)
      .map(x => x.it);
  }, [q, items]);

  React.useEffect(() => { setSel(0); }, [q]);

  React.useEffect(() => {
    if (!open) return;
    setQ(""); setSel(0);
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, [open]);

  const scrollToSection = (id: string) => {
    if (window.location.pathname.endsWith("/")) {
      // already on landing
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollTo: id } });
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: "smooth" });
      });
    }
  };

  const doAction = React.useCallback((item: Item | undefined) => {
    if (!item) return;
    if (item.kind === "action") {
      if (item.id === "github") window.open(REPO_URL, "_blank", "noopener");
      else if (item.id === "theme-toggle") onTheme();
      else if (item.id === "copy-install") {
        const cmd = "npx agent-ui add email-compose slack-message linear-issue";
        try { navigator.clipboard?.writeText(cmd); } catch { /* no-op */ }
        onCopy("Copied install command", cmd);
      }
    } else if (item.kind === "component") {
      if (item.stable) navigate(`/c/${item.id}`);
      else scrollToSection("browser");
    } else if (item.kind === "section") {
      scrollToSection(item.id);
    }
    onClose();
  }, [navigate, onClose, onTheme, onCopy]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")    { e.preventDefault(); onClose(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); setSel(s => Math.min(filtered.length - 1, s + 1)); }
      else if (e.key === "ArrowUp")   { e.preventDefault(); setSel(s => Math.max(0, s - 1)); }
      else if (e.key === "Enter")     { e.preventDefault(); doAction(filtered[sel]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, sel, onClose, doAction]);

  React.useEffect(() => {
    if (!open || !listRef.current) return;
    const node = listRef.current.querySelector(`[data-idx="${sel}"]`) as HTMLElement | null;
    node?.scrollIntoView({ block: "nearest" });
  }, [sel, open]);

  if (!open) return null;

  const groups: Array<{ kind: ItemKind; title: string }> = [
    { kind: "component", title: "Components" },
    { kind: "section",   title: "Sections" },
    { kind: "action",    title: "Actions" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onMouseDown={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "color-mix(in oklch, black 55%, transparent)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: "14vh", paddingLeft: 16, paddingRight: 16,
        animation: "fade-in .14s ease",
      }}
    >
      <div
        onMouseDown={e => e.stopPropagation()}
        style={{
          width: "min(620px, 100%)",
          background: "var(--bg-card)",
          border: "1px solid var(--border-strong)",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 30px 80px -20px rgb(0 0 0 / 0.6), 0 12px 24px -8px rgb(0 0 0 / 0.4)",
          animation: "rise-in .18s cubic-bezier(.2,.9,.2,1)",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 14px",
          borderBottom: "1px solid var(--border-faint)",
        }}>
          <Icon.Search size={15} style={{ color: "var(--fg-faint)" }} />
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Jump to a component, section, or action…"
            style={{
              flex: 1, background: "transparent", border: 0, outline: 0,
              fontSize: 14, color: "var(--fg)",
              fontFamily: "var(--font-sans)",
            }}
          />
          <Kbd>esc</Kbd>
        </div>

        <div ref={listRef} style={{ maxHeight: "52vh", overflowY: "auto", padding: 6 }}>
          {filtered.length === 0 && (
            <div style={{
              padding: "28px 16px", textAlign: "center",
              fontSize: 13, color: "var(--fg-faint)",
            }}>
              No matches. Try{" "}
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--fg-muted)" }}>email</span>,{" "}
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--fg-muted)" }}>slack</span>, or{" "}
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--fg-muted)" }}>github</span>.
            </div>
          )}
          {groups.map(g => {
            const inGroup = filtered.filter(it => it.kind === g.kind);
            if (inGroup.length === 0) return null;
            return (
              <div key={g.kind}>
                <div style={{
                  padding: "10px 10px 4px",
                  fontSize: 10.5, fontFamily: "var(--font-mono)",
                  textTransform: "uppercase", letterSpacing: 0.6,
                  color: "var(--fg-faint)",
                }}>{g.title}</div>
                {inGroup.map(item => {
                  const idx = filtered.indexOf(item);
                  const active = idx === sel;
                  return (
                    <button
                      key={item.kind + ":" + item.id}
                      data-idx={idx}
                      onMouseEnter={() => setSel(idx)}
                      onClick={() => doAction(item)}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        width: "100%", padding: "10px 12px",
                        background: active ? "var(--bg-inset)" : "transparent",
                        border: "1px solid " + (active ? "var(--border)" : "transparent"),
                        borderRadius: 8,
                        textAlign: "left", fontSize: 13,
                        color: "var(--fg)", cursor: "pointer",
                        marginBottom: 1,
                      }}
                    >
                      <span style={{
                        width: 22, display: "inline-flex", justifyContent: "center",
                        color: "var(--fg-faint)",
                      }}>
                        {item.kind === "action" && item.id === "github"        && <Icon.GitHub size={14} />}
                        {item.kind === "action" && item.id === "theme-toggle"  && <Icon.Sun size={14} />}
                        {item.kind === "action" && item.id === "copy-install"  && <Icon.Terminal size={14} />}
                        {item.kind === "section"                                && <Icon.ChevronRight size={14} />}
                        {item.kind === "component" && <Dot color={item.accent ?? "var(--fg-faint)"} size={6} />}
                      </span>
                      <span style={{ fontWeight: 500 }}>{item.name}</span>
                      <span style={{ flex: 1 }} />
                      {item.desc && (
                        <span style={{
                          color: "var(--fg-faint)", fontSize: 12,
                          maxWidth: 280, overflow: "hidden",
                          textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>{item.desc}</span>
                      )}
                      {item.kind === "component" && !item.stable && (
                        <Pill size="xs">soon</Pill>
                      )}
                      {active && <Icon.ArrowRight size={13} style={{ color: "var(--fg-faint)" }} />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "8px 14px",
          borderTop: "1px solid var(--border-faint)",
          fontFamily: "var(--font-mono)", fontSize: 11,
          color: "var(--fg-faint)",
        }}>
          <span><Kbd>↑</Kbd><Kbd>↓</Kbd> <span style={{ marginLeft: 4 }}>navigate</span></span>
          <span><Kbd>↵</Kbd> <span style={{ marginLeft: 4 }}>select</span></span>
          <span><Kbd>esc</Kbd> <span style={{ marginLeft: 4 }}>close</span></span>
          <div style={{ flex: 1 }} />
          <span>{filtered.length} item{filtered.length === 1 ? "" : "s"}</span>
        </div>
      </div>
    </div>
  );
}

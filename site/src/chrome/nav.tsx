import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Icon } from "./icons";
import { IconButton, Kbd } from "./primitives";
import { REPO_URL } from "./constants";

export function Nav({
  onOpenPalette, theme, onTheme,
}: {
  onOpenPalette: () => void;
  theme: "dark" | "light";
  onTheme: () => void;
}) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navLinks = [
    { label: "Components", target: "browser" },
    { label: "CLI",        target: "cli" },
    { label: "Principles", target: "principles" },
  ];

  const goSection = (id: string) => {
    if (pathname === "/") {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: "smooth" });
    } else {
      navigate(`/?s=${id}`);
    }
  };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      backdropFilter: "blur(12px) saturate(140%)",
      background: "color-mix(in oklch, var(--bg) 80%, transparent)",
      borderBottom: "1px solid var(--border-faint)",
    }}>
      <div className="wrap" style={{
        display: "flex", alignItems: "center", gap: 24, height: 56,
      }}>
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <span style={{
            width: 22, height: 22, borderRadius: 6,
            background: "var(--fg)", color: "var(--bg)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14,
          }}>a</span>
          <span style={{ fontWeight: 600, letterSpacing: -0.3 }}>agent-ui</span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 10.5,
            color: "var(--fg-faint)",
            padding: "1px 6px", border: "1px solid var(--border)",
            borderRadius: 4, marginLeft: 2,
          }}>0.1.0</span>
        </Link>

        <div style={{ display: "flex", gap: 22, marginLeft: 12 }}>
          {navLinks.map(l => (
            <button
              key={l.label}
              onClick={() => goSection(l.target)}
              style={{
                fontSize: 13.5, color: "var(--fg-muted)",
                fontWeight: 400, padding: 0,
              }}
            >{l.label}</button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <button
          onClick={onOpenPalette}
          aria-label="Open command palette"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            height: 32, padding: "0 10px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 8,
            fontSize: 12.5, color: "var(--fg-faint)",
            minWidth: 240, cursor: "pointer",
            transition: "border-color .12s",
          }}
        >
          <Icon.Search size={13} />
          <span>Search components…</span>
          <div style={{ flex: 1 }} />
          <Kbd>⌘</Kbd><Kbd>K</Kbd>
        </button>

        <IconButton
          icon={theme === "dark" ? <Icon.Sun size={16} /> : <Icon.Moon size={16} />}
          label={theme === "dark" ? "Switch to light" : "Switch to dark"}
          size={32}
          onClick={onTheme}
        />
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
          style={{
            width: 32, height: 32,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            borderRadius: 8, color: "var(--fg-dim)",
            transition: "background .12s, color .12s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-inset)"; e.currentTarget.style.color = "var(--fg)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--fg-dim)"; }}
        >
          <Icon.GitHub size={16} />
        </a>
      </div>
    </nav>
  );
}

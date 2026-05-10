import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Icon } from "./icons";
import { REPO_URL } from "./constants";

type Item = { label: string; href?: string; onClick?: () => void };

function FooterCol({ title, items }: { title: string; items: Item[] }) {
  return (
    <div>
      <div style={{
        fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6,
        color: "var(--fg-faint)", fontWeight: 500, marginBottom: 12,
      }}>{title}</div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map(i => (
          <li key={i.label}>
            {i.href ? (
              <a
                href={i.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--fg-muted)", display: "inline-flex", alignItems: "center", gap: 4 }}
              >
                {i.label}
                <Icon.ExternalLink size={11} style={{ color: "var(--fg-faint)" }} />
              </a>
            ) : (
              <button
                onClick={i.onClick}
                style={{ color: "var(--fg-muted)", padding: 0, background: "transparent", border: 0, cursor: "pointer", font: "inherit", textAlign: "left" }}
              >{i.label}</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const goSection = (id: string) => {
    if (pathname === "/") {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: "smooth" });
    } else {
      navigate(`/?s=${id}`);
    }
  };

  return (
    <footer style={{ padding: "60px 0 80px" }}>
      <div className="wrap">
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 480 }}>
            <div style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 38, letterSpacing: -0.6, lineHeight: 1.1,
            }}>
              The components are the project.
            </div>
            <p style={{
              marginTop: 14, fontSize: 13.5,
              color: "var(--fg-muted)", lineHeight: 1.55,
            }}>
              MIT-licensed. Built for anyone shipping agents into the world. No telemetry, no lock-in, no abstraction tax.
            </p>
          </div>
          <div style={{ display: "flex", gap: 48, fontSize: 13, color: "var(--fg-muted)" }}>
            <FooterCol title="Library" items={[
              { label: "Components",  onClick: () => goSection("browser") },
              { label: "CLI",         onClick: () => goSection("cli") },
              { label: "Principles",  onClick: () => goSection("principles") },
            ]} />
            <FooterCol title="Project" items={[
              { label: "GitHub",       href: REPO_URL },
              { label: "Issues",       href: REPO_URL + "/issues" },
              { label: "Discussions",  href: REPO_URL + "/discussions" },
            ]} />
            <FooterCol title="Legal" items={[
              { label: "MIT license",  href: REPO_URL + "/blob/main/LICENSE" },
            ]} />
          </div>
        </div>
        <div style={{
          marginTop: 56, paddingTop: 20,
          borderTop: "1px solid var(--border-faint)",
          display: "flex", justifyContent: "space-between",
          fontFamily: "var(--font-mono)", fontSize: 11.5,
          color: "var(--fg-faint)",
        }}>
          <span>agent-ui · 0.1.0 · stable: 3 / target: 10</span>
          <span>not affiliated with any of the products it evokes.</span>
        </div>
      </div>
    </footer>
  );
}

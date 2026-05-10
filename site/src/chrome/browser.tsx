import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "./icons";
import { Dot, SectionHeader } from "./primitives";
import { REGISTRY, STABLE, SOON, type ComponentMeta } from "../registry";
import { REPO_URL } from "./constants";

export function Browser() {
  return (
    <section id="browser" style={{ padding: "80px 0", borderBottom: "1px solid var(--border)" }}>
      <div className="wrap">
        <SectionHeader
          eyebrow="components/"
          title="Components you wish you didn't have to build."
          subtitle="Run one command. The source lands in your repo. You own it from there."
        />

        <div style={{
          marginTop: 40,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}>
          {REGISTRY.map(c => <ComponentCard key={c.id} c={c as ComponentMeta} />)}
        </div>

        <div style={{
          marginTop: 28,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          fontSize: 12.5, color: "var(--fg-muted)",
          fontFamily: "var(--font-mono)",
        }}>
          <span>{STABLE.length} stable · {SOON.length} on the way</span>
          <a
            href={REPO_URL + "/issues/new?labels=component-request"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--fg-muted)", display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            request a component
            <Icon.ExternalLink size={11} style={{ color: "var(--fg-faint)" }} />
          </a>
        </div>
      </div>
    </section>
  );
}

function ComponentCard({ c }: { c: ComponentMeta }) {
  const [hover, setHover] = React.useState(false);
  const isStable = c.status === "stable";
  const Tag: React.ElementType = isStable ? Link : "div";
  const tagProps = isStable ? { to: `/c/${c.id}` } : {};

  return (
    <Tag
      {...tagProps}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block", textAlign: "left", padding: 0,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 12, overflow: "hidden",
        cursor: isStable ? "pointer" : "default",
        transition: "transform .14s ease, border-color .14s ease",
        transform: hover && isStable ? "translateY(-2px)" : "none",
        borderColor: hover && isStable ? "var(--border-strong)" : "var(--border)",
        opacity: isStable ? 1 : 0.66,
        textDecoration: "none", color: "inherit",
      }}
    >
      <div style={{
        height: 132, position: "relative",
        background:
          "linear-gradient(180deg, " +
          "color-mix(in oklch, " + c.accent + " 14%, var(--bg-inset)) 0%, " +
          "var(--bg-inset) 100%)",
        borderBottom: "1px solid var(--border)",
        overflow: "hidden",
      }}>
        <CardPreview id={c.id} accent={c.accent} />
        {!isStable && (
          <div style={{
            position: "absolute", top: 10, right: 10,
            fontSize: 10, fontFamily: "var(--font-mono)",
            padding: "3px 6px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 4, color: "var(--fg-faint)",
            letterSpacing: 0.4, textTransform: "uppercase",
          }}>soon</div>
        )}
      </div>

      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Dot color={c.accent} size={6} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--fg-faint)",
          }}>{c.name}</span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}>{c.title}</div>
        <div style={{
          marginTop: 6, fontSize: 12.5, color: "var(--fg-muted)", lineHeight: 1.5,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {c.summary}
        </div>
      </div>
    </Tag>
  );
}

function CardPreview({ id, accent }: { id: string; accent: string }) {
  if (id === "github-pr-review") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 280 132" preserveAspectRatio="xMidYMid slice">
        <rect x="20" y="14" width="240" height="100" rx="6" fill="var(--bg-card)" stroke="var(--border)" />
        <rect x="32" y="28" width="80" height="6" rx="3" fill={accent} />
        <rect x="32" y="42" width="160" height="4" rx="2" fill="var(--fg-faint)" opacity=".5" />
        <rect x="32" y="58" width="60" height="14" rx="3" fill="var(--c-ok)" opacity=".18" />
        <rect x="98" y="58" width="60" height="14" rx="3" fill="var(--fg-faint)" opacity=".15" />
        <rect x="164" y="58" width="60" height="14" rx="3" fill="var(--c-warn)" opacity=".18" />
        <rect x="32" y="84" width="50" height="14" rx="3" fill={accent} />
        <rect x="88" y="84" width="50" height="14" rx="3" fill="var(--fg-faint)" opacity=".2" />
      </svg>
    );
  }
  if (id === "file-patch-preview") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 280 132" preserveAspectRatio="xMidYMid slice">
        <rect x="20" y="14" width="240" height="100" rx="6" fill="oklch(0.11 0.005 80)" stroke="var(--border)" />
        <rect x="20" y="14" width="240" height="22" fill="var(--bg-inset)" />
        <rect x="32" y="22" width="80" height="6" rx="3" fill="var(--fg-faint)" />
        <rect x="32" y="42" width="200" height="6" rx="2" fill="var(--c-err)" opacity=".22" />
        <rect x="32" y="52" width="180" height="6" rx="2" fill="var(--c-err)" opacity=".22" />
        <rect x="32" y="64" width="220" height="6" rx="2" fill={accent} opacity=".22" />
        <rect x="32" y="74" width="200" height="6" rx="2" fill={accent} opacity=".22" />
        <rect x="32" y="84" width="160" height="6" rx="2" fill={accent} opacity=".22" />
        <rect x="32" y="96" width="100" height="6" rx="2" fill="var(--fg-faint)" opacity=".4" />
      </svg>
    );
  }
  if (id === "shell-command") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 280 132" preserveAspectRatio="xMidYMid slice">
        <rect x="20" y="14" width="240" height="100" rx="6" fill="oklch(0.11 0.005 80)" stroke="var(--border)" />
        <rect x="20" y="14" width="240" height="22" fill="var(--bg-inset)" />
        <circle cx="32" cy="25" r="3" fill={accent} />
        <rect x="44" y="22" width="60" height="6" rx="3" fill="var(--fg-faint)" />
        <rect x="32" y="48" width="6" height="6" rx="3" fill="var(--c-ok)" />
        <rect x="44" y="48" width="180" height="6" rx="3" fill="var(--fg-muted)" />
        <rect x="44" y="60" width="140" height="4" rx="2" fill="var(--fg-faint)" opacity=".7" />
        <rect x="44" y="74" width="160" height="4" rx="2" fill="var(--fg-faint)" opacity=".5" />
        <rect x="44" y="84" width="100" height="4" rx="2" fill="var(--fg-faint)" opacity=".5" />
      </svg>
    );
  }
  if (id === "sql-query-runner") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 280 132" preserveAspectRatio="xMidYMid slice">
        <rect x="20" y="14" width="240" height="100" rx="6" fill="oklch(0.11 0.005 80)" stroke="var(--border)" />
        <rect x="20" y="14" width="240" height="22" fill="var(--bg-inset)" />
        <rect x="32" y="22" width="50" height="8" rx="2" fill={accent} />
        <rect x="220" y="22" width="32" height="8" rx="2" fill="var(--c-warn)" opacity=".5" />
        <rect x="32" y="46" width="64" height="6" rx="2" fill="var(--c-linear)" />
        <rect x="100" y="46" width="124" height="6" rx="2" fill="var(--fg-muted)" />
        <rect x="32" y="60" width="44" height="6" rx="2" fill="var(--c-linear)" />
        <rect x="80" y="60" width="100" height="6" rx="2" fill="var(--c-mail)" />
        <rect x="32" y="74" width="160" height="6" rx="2" fill="var(--fg-muted)" opacity=".7" />
        <rect x="32" y="92" width="60" height="10" rx="3" fill={accent} opacity=".4" />
        <rect x="98" y="92" width="50" height="10" rx="3" fill="var(--fg-faint)" opacity=".3" />
      </svg>
    );
  }
  if (id === "calendar-event") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 280 132" preserveAspectRatio="xMidYMid slice">
        <rect x="20" y="14" width="240" height="100" rx="6" fill="var(--bg-card)" stroke="var(--border)" />
        <rect x="32" y="26" width="100" height="8" rx="3" fill={accent} />
        <rect x="32" y="44" width="60" height="14" rx="3" fill={accent} opacity=".18" />
        <rect x="100" y="44" width="60" height="14" rx="3" fill={accent} opacity=".18" />
        <circle cx="40" cy="78" r="6" fill={accent} opacity=".4" />
        <circle cx="56" cy="78" r="6" fill={accent} opacity=".4" />
        <circle cx="72" cy="78" r="6" fill="var(--c-warn)" opacity=".5" />
        <rect x="32" y="92" width="220" height="4" rx="2" fill="var(--fg-faint)" opacity=".4" />
      </svg>
    );
  }
  if (id === "github-issue") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 280 132" preserveAspectRatio="xMidYMid slice">
        <rect x="20" y="14" width="170" height="100" rx="6" fill="var(--bg-card)" stroke="var(--border)" />
        <rect x="200" y="14" width="60" height="100" rx="6" fill="var(--bg-inset)" stroke="var(--border)" />
        <rect x="32" y="28" width="100" height="6" rx="3" fill="var(--fg)" />
        <rect x="32" y="44" width="146" height="4" rx="2" fill="var(--fg-faint)" opacity=".5" />
        <rect x="32" y="54" width="120" height="4" rx="2" fill="var(--fg-faint)" opacity=".5" />
        <rect x="32" y="64" width="140" height="4" rx="2" fill="var(--fg-faint)" opacity=".5" />
        <rect x="32" y="92" width="20" height="10" rx="5" fill="var(--c-err)" opacity=".4" />
        <rect x="56" y="92" width="36" height="10" rx="5" fill={accent} opacity=".3" />
        <rect x="208" y="28" width="44" height="6" rx="3" fill="var(--fg-faint)" opacity=".5" />
        <circle cx="216" cy="56" r="6" fill="var(--c-mail)" opacity=".5" />
        <circle cx="232" cy="56" r="6" fill="var(--c-slack)" opacity=".5" />
      </svg>
    );
  }
  if (id === "notion-page") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 280 132" preserveAspectRatio="xMidYMid slice">
        <rect x="20" y="14" width="240" height="100" rx="6" fill="var(--bg-card)" stroke="var(--border)" />
        <rect x="32" y="24" width="120" height="10" rx="3" fill="var(--fg)" />
        <rect x="32" y="44" width="60" height="6" rx="3" fill={accent} />
        <rect x="32" y="58" width="200" height="4" rx="2" fill="var(--fg-faint)" opacity=".5" />
        <rect x="36" y="68" width="4" height="4" rx="2" fill="var(--fg-faint)" />
        <rect x="44" y="68" width="180" height="4" rx="2" fill="var(--fg-faint)" opacity=".5" />
        <rect x="36" y="78" width="4" height="4" rx="2" fill="var(--fg-faint)" />
        <rect x="44" y="78" width="160" height="4" rx="2" fill="var(--fg-faint)" opacity=".5" />
        <rect x="32" y="92" width="10" height="10" rx="2" fill={accent} opacity=".5" />
        <rect x="46" y="94" width="100" height="6" rx="2" fill="var(--fg-faint)" opacity=".5" />
      </svg>
    );
  }
  if (id === "http-request") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 280 132" preserveAspectRatio="xMidYMid slice">
        <rect x="20" y="14" width="240" height="100" rx="6" fill="var(--bg-card)" stroke="var(--border)" />
        <rect x="32" y="28" width="40" height="14" rx="3" fill={accent} opacity=".4" />
        <rect x="78" y="28" width="160" height="14" rx="3" fill="var(--bg-inset)" stroke="var(--border-faint)" />
        <rect x="32" y="54" width="60" height="6" rx="3" fill="var(--c-slack)" />
        <rect x="100" y="54" width="120" height="6" rx="3" fill="var(--c-mail)" />
        <rect x="32" y="68" width="60" height="6" rx="3" fill="var(--c-slack)" />
        <rect x="100" y="68" width="100" height="6" rx="3" fill="var(--c-mail)" />
        <rect x="32" y="84" width="200" height="4" rx="2" fill="var(--fg-faint)" opacity=".5" />
        <rect x="32" y="94" width="160" height="4" rx="2" fill="var(--fg-faint)" opacity=".5" />
      </svg>
    );
  }
  if (id === "stripe-payment") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 280 132" preserveAspectRatio="xMidYMid slice">
        <rect x="20" y="14" width="240" height="100" rx="6" fill="var(--bg-card)" stroke="var(--border)" />
        <text x="140" y="64" fontFamily="Geist, sans-serif" fontSize="32" fontWeight="600" fill="var(--fg)" textAnchor="middle">$49.00</text>
        <rect x="32" y="80" width="60" height="14" rx="7" fill={accent} opacity=".5" />
        <circle cx="60" cy="100" r="4" fill="var(--fg-faint)" />
        <rect x="72" y="98" width="80" height="6" rx="2" fill="var(--fg-faint)" opacity=".5" />
        <rect x="180" y="96" width="60" height="10" rx="2" fill="var(--bg-inset)" stroke="var(--border)" />
      </svg>
    );
  }
  if (id === "sms-message") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 280 132" preserveAspectRatio="xMidYMid slice">
        <rect x="20" y="14" width="240" height="100" rx="6" fill="var(--bg-card)" stroke="var(--border)" />
        <circle cx="40" cy="40" r="10" fill={accent} opacity=".5" />
        <rect x="56" y="36" width="50" height="6" rx="3" fill="var(--fg)" />
        <rect x="56" y="48" width="100" height="4" rx="2" fill="var(--fg-faint)" />
        <rect x="120" y="64" width="120" height="20" rx="10" fill={accent} />
        <rect x="130" y="92" width="80" height="4" rx="2" fill="var(--fg-faint)" opacity=".5" />
      </svg>
    );
  }
  if (id === "email-compose") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 280 132" preserveAspectRatio="xMidYMid slice">
        <rect x="20" y="20" width="240" height="92" rx="6" fill="var(--bg-card)" stroke="var(--border)" />
        <rect x="20" y="20" width="2" height="92" fill={accent} />
        <rect x="32" y="32" width="80" height="6" rx="3" fill="var(--fg-faint)" />
        <rect x="32" y="46" width="160" height="4" rx="2" fill="var(--fg-faint)" opacity=".5" />
        <rect x="32" y="58" width="200" height="4" rx="2" fill="var(--fg-faint)" opacity=".5" />
        <rect x="32" y="68" width="140" height="4" rx="2" fill="var(--fg-faint)" opacity=".5" />
        <rect x="220" y="92" width="32" height="12" rx="3" fill={accent} />
      </svg>
    );
  }
  if (id === "slack-message") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 280 132" preserveAspectRatio="xMidYMid slice">
        <rect x="20" y="14" width="240" height="40" rx="6" fill="var(--bg-card)" stroke="var(--border)" />
        <circle cx="36" cy="34" r="8" fill={accent} opacity=".4" />
        <rect x="50" y="24" width="48" height="5" rx="2.5" fill="var(--fg-faint)" />
        <rect x="50" y="34" width="180" height="4" rx="2" fill="var(--fg-faint)" opacity=".5" />
        <rect x="50" y="44" width="120" height="4" rx="2" fill="var(--fg-faint)" opacity=".5" />
        <rect x="20" y="64" width="240" height="50" rx="6" fill="var(--bg-card)" stroke={accent} strokeOpacity=".5" />
        <rect x="32" y="76" width="160" height="4" rx="2" fill="var(--fg-faint)" />
        <rect x="32" y="86" width="120" height="4" rx="2" fill="var(--fg-faint)" opacity=".6" />
        <rect x="32" y="100" width="14" height="6" rx="2" fill={accent} opacity=".4" />
        <rect x="50" y="100" width="14" height="6" rx="2" fill={accent} opacity=".4" />
      </svg>
    );
  }
  if (id === "linear-issue") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 280 132" preserveAspectRatio="xMidYMid slice">
        <rect x="20" y="14" width="170" height="100" rx="6" fill="var(--bg-card)" stroke="var(--border)" />
        <rect x="200" y="14" width="60" height="100" rx="6" fill="var(--bg-inset)" stroke="var(--border)" />
        <rect x="32" y="28" width="100" height="6" rx="3" fill="var(--fg)" />
        <rect x="32" y="44" width="146" height="4" rx="2" fill="var(--fg-faint)" opacity=".5" />
        <rect x="32" y="54" width="120" height="4" rx="2" fill="var(--fg-faint)" opacity=".5" />
        <rect x="32" y="64" width="140" height="4" rx="2" fill="var(--fg-faint)" opacity=".5" />
        <rect x="32" y="92" width="20" height="10" rx="5" fill={accent} opacity=".4" />
        <rect x="56" y="92" width="28" height="10" rx="5" fill={accent} opacity=".25" />
        <rect x="208" y="28" width="44" height="6" rx="3" fill="var(--fg-faint)" opacity=".5" />
        <rect x="208" y="44" width="32" height="10" rx="3" fill={accent} />
        <rect x="208" y="64" width="44" height="6" rx="3" fill="var(--fg-faint)" opacity=".5" />
        <rect x="208" y="80" width="38" height="10" rx="3" fill="var(--fg-faint)" opacity=".3" />
      </svg>
    );
  }
  return (
    <svg width="100%" height="100%" viewBox="0 0 280 132" preserveAspectRatio="xMidYMid slice">
      <rect x="22" y="22" width="236" height="88" rx="6" fill="var(--bg-card)" stroke="var(--border)" />
      <rect x="22" y="22" width="2" height="88" fill={accent} />
      <rect x="38" y="38" width="60" height="6" rx="3" fill="var(--fg-faint)" opacity=".7" />
      <rect x="38" y="54" width="180" height="4" rx="2" fill="var(--fg-faint)" opacity=".4" />
      <rect x="38" y="64" width="140" height="4" rx="2" fill="var(--fg-faint)" opacity=".4" />
      <rect x="38" y="86" width="40" height="10" rx="3" fill={accent} opacity=".5" />
    </svg>
  );
}

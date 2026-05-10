import React from "react";
import type { CSSProperties, ReactNode } from "react";
import { Icon } from "./icons";

export function hashHue(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

export function Avatar({ name = "?", color, size = 28, ring = false }: {
  name?: string; color?: number; size?: number; ring?: boolean;
}) {
  const initials = name.split(/\s+/).slice(0, 2).map(s => s[0] || "").join("").toUpperCase();
  const hue = color ?? hashHue(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: `oklch(0.42 0.08 ${hue})`,
      color: `oklch(0.96 0.04 ${hue})`,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.42, fontWeight: 600, letterSpacing: 0.2,
      flexShrink: 0,
      boxShadow: ring ? `0 0 0 2px var(--bg-card)` : undefined,
    }}>
      {initials}
    </div>
  );
}

type Tone = "default" | "accent" | "ok" | "warn" | "err" | "solid";
type Size = "xs" | "sm" | "md";

const PILL_TONES: Record<Tone, { bg: string; fg: string; bd: string }> = {
  default: { bg: "var(--bg-inset)", fg: "var(--fg-muted)", bd: "var(--border)" },
  accent:  { bg: "color-mix(in oklch, var(--agent-ui-accent) 14%, transparent)", fg: "var(--agent-ui-accent)", bd: "color-mix(in oklch, var(--agent-ui-accent) 30%, transparent)" },
  ok:      { bg: "color-mix(in oklch, var(--c-ok) 14%, transparent)",   fg: "var(--c-ok)",   bd: "color-mix(in oklch, var(--c-ok) 30%, transparent)" },
  warn:    { bg: "color-mix(in oklch, var(--c-warn) 14%, transparent)", fg: "var(--c-warn)", bd: "color-mix(in oklch, var(--c-warn) 30%, transparent)" },
  err:     { bg: "color-mix(in oklch, var(--c-err) 14%, transparent)",  fg: "var(--c-err)",  bd: "color-mix(in oklch, var(--c-err) 30%, transparent)" },
  solid:   { bg: "var(--fg)", fg: "var(--bg)", bd: "var(--fg)" },
};
const PILL_SIZES: Record<Size, { px: number; py: number; fs: number; h: number }> = {
  xs: { px: 6, py: 1, fs: 10.5, h: 18 },
  sm: { px: 8, py: 2, fs: 11.5, h: 22 },
  md: { px: 10, py: 4, fs: 12.5, h: 26 },
};

export function Pill({
  children, tone = "default", size = "sm", icon, style = {}, onClick,
}: {
  children: ReactNode; tone?: Tone; size?: Size; icon?: ReactNode;
  style?: CSSProperties; onClick?: () => void;
}) {
  const t = PILL_TONES[tone];
  const s = PILL_SIZES[size];
  return (
    <span
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: `${s.py}px ${s.px}px`, height: s.h, fontSize: s.fs,
        fontWeight: 500, background: t.bg, color: t.fg,
        border: `1px solid ${t.bd}`, borderRadius: 999, lineHeight: 1,
        whiteSpace: "nowrap", fontFamily: "var(--font-sans)",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {icon}
      {children}
    </span>
  );
}

type ButtonVariant = "default" | "primary" | "ghost" | "danger" | "solid";
type ButtonSize = "sm" | "md" | "lg";

const BTN_VARIANTS: Record<ButtonVariant, { bg: string; fg: string; bd: string; hbg: string }> = {
  default: { bg: "var(--bg-inset)", fg: "var(--fg)", bd: "var(--border)", hbg: "var(--bg-elev)" },
  primary: { bg: "var(--agent-ui-accent)", fg: "var(--agent-ui-accent-ink)", bd: "var(--agent-ui-accent)", hbg: "color-mix(in oklch, var(--agent-ui-accent) 90%, white)" },
  ghost:   { bg: "transparent", fg: "var(--fg-muted)", bd: "transparent", hbg: "var(--bg-inset)" },
  danger:  { bg: "transparent", fg: "var(--c-err)", bd: "color-mix(in oklch, var(--c-err) 40%, transparent)", hbg: "color-mix(in oklch, var(--c-err) 12%, transparent)" },
  solid:   { bg: "var(--fg)", fg: "var(--bg)", bd: "var(--fg)", hbg: "var(--fg)" },
};
const BTN_SIZES: Record<ButtonSize, { h: number; px: number; fs: number; gap: number; r: number }> = {
  sm: { h: 28, px: 10, fs: 12.5, gap: 6, r: 8 },
  md: { h: 34, px: 14, fs: 13.5, gap: 8, r: 8 },
  lg: { h: 42, px: 18, fs: 14.5, gap: 8, r: 10 },
};

export function Button({
  children, variant = "default", size = "md", icon, iconRight, full,
  onClick, disabled, type = "button", style = {},
}: {
  children?: ReactNode; variant?: ButtonVariant; size?: ButtonSize;
  icon?: ReactNode; iconRight?: ReactNode; full?: boolean;
  onClick?: () => void; disabled?: boolean; type?: "button" | "submit" | "reset";
  style?: CSSProperties;
}) {
  const v = BTN_VARIANTS[variant];
  const s = BTN_SIZES[size];
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: s.gap, height: s.h, padding: `0 ${s.px}px`,
        fontSize: s.fs, fontWeight: 500,
        background: hover && !disabled ? v.hbg : v.bg,
        color: v.fg, border: `1px solid ${v.bd}`, borderRadius: s.r,
        width: full ? "100%" : undefined,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background .12s ease, border-color .12s ease, transform .12s ease",
        transform: hover && !disabled ? "translateY(-0.5px)" : "none",
        ...style,
      }}
    >
      {icon}{children}{iconRight}
    </button>
  );
}

export function IconButton({ icon, onClick, label, active, size = 28, style = {} }: {
  icon: ReactNode; onClick?: () => void; label?: string; active?: boolean;
  size?: number; style?: CSSProperties;
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: size, height: size,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        borderRadius: 8,
        color: active ? "var(--fg)" : "var(--fg-dim)",
        background: hover || active ? "var(--bg-inset)" : "transparent",
        transition: "background .12s ease, color .12s ease",
        ...style,
      }}
    >
      {icon}
    </button>
  );
}

export function AgentBadge({ agent = "Agent", action }: { agent?: string; action?: string }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "5px 10px 5px 8px",
      fontSize: 11.5, fontFamily: "var(--font-mono)",
      color: "var(--agent-ui-accent)",
      background: "color-mix(in oklch, var(--agent-ui-accent) 10%, transparent)",
      border: "1px solid color-mix(in oklch, var(--agent-ui-accent) 28%, transparent)",
      borderRadius: 999, letterSpacing: -0.1,
    }}>
      <span style={{ position: "relative", display: "inline-flex" }}>
        <span style={{
          width: 6, height: 6, borderRadius: 999,
          background: "var(--agent-ui-accent)",
          animation: "pulse-ring 1.6s ease-out infinite",
        }} />
      </span>
      <span style={{ color: "var(--fg-muted)" }}>{agent}</span>
      <span style={{ color: "var(--fg-faint)" }}>›</span>
      <span style={{ color: "var(--fg)" }}>{action}</span>
    </div>
  );
}

export function ModalShell({
  children, width = 620, accent = "var(--agent-ui-accent)", footer, header, style = {},
}: {
  children?: ReactNode; width?: number; accent?: string;
  footer?: ReactNode; header?: ReactNode; style?: CSSProperties;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        width,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow:
          "0 1px 0 0 color-mix(in oklch, white 6%, transparent) inset, " +
          "0 30px 60px -20px rgb(0 0 0 / .55), 0 12px 24px -12px rgb(0 0 0 / .4)",
        position: "relative",
        ...style,
      }}
    >
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: 2, background: accent, opacity: .9,
      }} />
      {header}
      {children}
      {footer}
    </div>
  );
}

export function CopyButton({ value, label = "Copy", style = {} }: {
  value: string; label?: string; style?: CSSProperties;
}) {
  const [copied, setCopied] = React.useState(false);
  const onClick = () => {
    try { navigator.clipboard?.writeText(value); } catch { /* no-op */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        height: 28, padding: "0 10px",
        fontSize: 12, fontFamily: "var(--font-mono)",
        color: copied ? "var(--agent-ui-accent)" : "var(--fg-muted)",
        background: "var(--bg-inset)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        transition: "color .12s",
        ...style,
      }}
    >
      {copied ? <Icon.Check size={13} /> : <Icon.Copy size={13} />}
      <span>{copied ? "copied" : label}</span>
    </button>
  );
}

export function InstallCommand({ name, style = {} }: { name: string; style?: CSSProperties }) {
  const cmd = `npx agent-ui add ${name}`;
  return (
    <div style={{
      display: "flex", alignItems: "stretch",
      background: "var(--bg-inset)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      overflow: "hidden",
      fontFamily: "var(--font-mono)", fontSize: 13,
      ...style,
    }}>
      <div style={{
        display: "flex", alignItems: "center", padding: "0 10px 0 14px",
        color: "var(--fg-faint)",
      }}>
        <Icon.ChevronRight size={14} />
      </div>
      <div style={{
        flex: 1, padding: "12px 4px 12px 0", color: "var(--fg)",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>
        <span style={{ color: "var(--fg-faint)" }}>npx </span>
        <span style={{ color: "var(--agent-ui-accent)" }}>agent-ui</span>
        <span style={{ color: "var(--fg-muted)" }}> add </span>
        <span style={{ color: "var(--fg)" }}>{name}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", padding: "6px" }}>
        <CopyButton value={cmd} />
      </div>
    </div>
  );
}

export function Dot({ color = "var(--fg-faint)", size = 5 }: { color?: string; size?: number }) {
  return <span style={{
    display: "inline-block", width: size, height: size, borderRadius: 999, background: color,
    flexShrink: 0,
  }} />;
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      minWidth: 18, height: 18, padding: "0 4px",
      fontFamily: "var(--font-mono)", fontSize: 10.5,
      color: "var(--fg-muted)",
      background: "var(--bg-inset)",
      border: "1px solid var(--border)",
      borderRadius: 4,
      lineHeight: 1,
    }}>{children}</kbd>
  );
}

export function SectionHeader({ eyebrow, title, subtitle }: {
  eyebrow?: string; title: ReactNode; subtitle?: ReactNode;
}) {
  return (
    <div>
      {eyebrow && (
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 12,
          color: "var(--fg-faint)", letterSpacing: 0.4,
          marginBottom: 14,
        }}>{eyebrow}</div>
      )}
      <h2 style={{
        fontSize: 42, lineHeight: 1.05,
        fontWeight: 600, letterSpacing: -1,
        margin: 0, maxWidth: 760,
        textWrap: "balance" as const,
      }}>{title}</h2>
      {subtitle && (
        <p style={{
          marginTop: 14, maxWidth: 620,
          fontSize: 16, lineHeight: 1.55,
          color: "var(--fg-muted)",
        }}>{subtitle}</p>
      )}
    </div>
  );
}


// ============================================================
// components/icons.jsx
// ============================================================
// Lucide-shaped inline SVG icons. Single source of truth.
// Stroke 1.6, 24x24, currentColor.

const _i = (paths, vb = "0 0 24 24") => ({ size = 16, className = "", style = {}, strokeWidth = 1.6, ...rest }) => (
  <svg
    viewBox={vb}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
    {...rest}
  >
    {paths}
  </svg>
);

const Icon = {
  Check:   _i(<><path d="M20 6 9 17l-5-5" /></>),
  X:       _i(<><path d="M18 6 6 18M6 6l12 12" /></>),
  Send:    _i(<><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7Z" /></>),
  Edit:    _i(<><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" /></>),
  Sparkles:_i(<><path d="M9 3 11 9l6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" /><path d="M19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" /></>),
  Bot:     _i(<><rect x="3" y="8" width="18" height="12" rx="3" /><path d="M12 8V4" /><circle cx="12" cy="3" r="1" /><path d="M8 14v.5M16 14v.5" strokeLinecap="round" /><path d="M9 18h6" /></>),
  Terminal:_i(<><path d="m4 7 5 5-5 5" /><path d="M12 19h8" /></>),
  Copy:    _i(<><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>),
  ArrowRight: _i(<><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>),
  ChevronDown: _i(<><path d="m6 9 6 6 6-6" /></>),
  ChevronRight:_i(<><path d="m9 6 6 6-6 6" /></>),
  Paperclip: _i(<><path d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l8.57-8.57a4 4 0 0 1 5.66 5.66l-8.58 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" /></>),
  Hash:    _i(<><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" /></>),
  Lock:    _i(<><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>),
  AtSign:  _i(<><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" /></>),
  Smile:   _i(<><circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><path d="M9 9h.01M15 9h.01" /></>),
  Image:   _i(<><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5-9 9" /></>),
  Bold:    _i(<><path d="M6 4h7a4 4 0 0 1 0 8H6zM6 12h8a4 4 0 0 1 0 8H6z" /></>),
  Italic:  _i(<><path d="M19 4h-9M14 20H5M15 4 9 20" /></>),
  Link:    _i(<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>),
  List:    _i(<><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></>),
  Code:    _i(<><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></>),
  Diff:    _i(<><path d="M12 3v18" /><path d="M5 8h6M5 16h6" /><path d="M14 12h7M17.5 8.5v7" /></>),
  Flag:    _i(<><path d="M4 22V4M4 4h12l-2 4 2 4H4" /></>),
  AlertTriangle: _i(<><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" /><path d="M12 9v4M12 17h.01" /></>),
  Calendar:_i(<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>),
  Tag:     _i(<><path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" /><circle cx="7" cy="7" r="1" /></>),
  User:    _i(<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>),
  Users:   _i(<><circle cx="9" cy="8" r="3.5" /><path d="M2 21a7 7 0 0 1 14 0" /><circle cx="17" cy="6" r="3" /><path d="M22 18a5 5 0 0 0-5-5" /></>),
  Plus:    _i(<><path d="M12 5v14M5 12h14" /></>),
  Minus:   _i(<><path d="M5 12h14" /></>),
  Layers:  _i(<><path d="m12 2 10 6-10 6L2 8z" /><path d="m2 16 10 6 10-6" /><path d="m2 12 10 6 10-6" /></>),
  Logo:    _i(<><circle cx="12" cy="12" r="9" strokeWidth="1.4" /><path d="M7 12h10M12 7v10" strokeWidth="1.4" /></>),
  GitHub:  _i(<><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.36-1.34-3.36-1.34-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.9 1.54 2.36 1.1 2.94.84.09-.65.35-1.1.63-1.35-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" stroke="none" fill="currentColor" /></>),
  Search:  _i(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>),
  Sun:     _i(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></>),
  Moon:    _i(<><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" /></>),
  Share:   _i(<><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></>),
  ExternalLink: _i(<><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6M10 14 21 3" /></>),
};

window.Icon = Icon;


// ============================================================
// components/primitives.jsx
// ============================================================
// Shared primitives: Modal chrome, Pill, Avatar, ToastResult, CopyButton, etc.

const cx = (...xs) => xs.filter(Boolean).join(" ");

// ---------- Avatar ----------
function Avatar({ name = "?", color, size = 28, ring = false }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map(s => s[0])
    .join("")
    .toUpperCase();
  const hue = color ?? hashHue(name);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: `oklch(0.42 0.08 ${hue})`,
        color: `oklch(0.96 0.04 ${hue})`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.42,
        fontWeight: 600,
        letterSpacing: 0.2,
        flexShrink: 0,
        boxShadow: ring ? `0 0 0 2px var(--bg-card)` : undefined,
      }}
    >
      {initials}
    </div>
  );
}

function hashHue(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

// ---------- Pill ----------
function Pill({ children, tone = "default", size = "sm", icon, style = {}, onClick }) {
  const tones = {
    default: { bg: "var(--bg-inset)", fg: "var(--fg-muted)", bd: "var(--border)" },
    accent:  { bg: "color-mix(in oklch, var(--agent-ui-accent) 14%, transparent)", fg: "var(--agent-ui-accent)", bd: "color-mix(in oklch, var(--agent-ui-accent) 30%, transparent)" },
    ok:      { bg: "color-mix(in oklch, var(--c-ok) 14%, transparent)", fg: "var(--c-ok)", bd: "color-mix(in oklch, var(--c-ok) 30%, transparent)" },
    warn:    { bg: "color-mix(in oklch, var(--c-warn) 14%, transparent)", fg: "var(--c-warn)", bd: "color-mix(in oklch, var(--c-warn) 30%, transparent)" },
    err:     { bg: "color-mix(in oklch, var(--c-err) 14%, transparent)", fg: "var(--c-err)", bd: "color-mix(in oklch, var(--c-err) 30%, transparent)" },
    solid:   { bg: "var(--fg)", fg: "var(--bg)", bd: "var(--fg)" },
  };
  const t = tones[tone] || tones.default;
  const sizes = {
    xs: { px: 6,  py: 1, fs: 10.5, h: 18 },
    sm: { px: 8,  py: 2, fs: 11.5, h: 22 },
    md: { px: 10, py: 4, fs: 12.5, h: 26 },
  };
  const s = sizes[size];
  return (
    <span
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: `${s.py}px ${s.px}px`,
        height: s.h,
        fontSize: s.fs,
        fontWeight: 500,
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.bd}`,
        borderRadius: 999,
        lineHeight: 1,
        whiteSpace: "nowrap",
        fontFamily: "var(--font-sans)",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {icon}
      {children}
    </span>
  );
}

// ---------- Button ----------
function Button({ children, variant = "default", size = "md", icon, iconRight, full, onClick, disabled, type = "button", style = {} }) {
  const variants = {
    default: { bg: "var(--bg-inset)", fg: "var(--fg)", bd: "var(--border)", hbg: "var(--bg-elev)" },
    primary: { bg: "var(--agent-ui-accent)", fg: "var(--agent-ui-accent-ink)", bd: "var(--agent-ui-accent)", hbg: "color-mix(in oklch, var(--agent-ui-accent) 90%, white)" },
    ghost:   { bg: "transparent", fg: "var(--fg-muted)", bd: "transparent", hbg: "var(--bg-inset)" },
    danger:  { bg: "transparent", fg: "var(--c-err)", bd: "color-mix(in oklch, var(--c-err) 40%, transparent)", hbg: "color-mix(in oklch, var(--c-err) 12%, transparent)" },
    solid:   { bg: "var(--fg)", fg: "var(--bg)", bd: "var(--fg)", hbg: "var(--fg)" },
  };
  const v = variants[variant];
  const sizes = {
    sm: { h: 28, px: 10, fs: 12.5, gap: 6, r: 8 },
    md: { h: 34, px: 14, fs: 13.5, gap: 8, r: 8 },
    lg: { h: 42, px: 18, fs: 14.5, gap: 8, r: 10 },
  };
  const s = sizes[size];
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        height: s.h,
        padding: `0 ${s.px}px`,
        fontSize: s.fs,
        fontWeight: 500,
        background: hover && !disabled ? v.hbg : v.bg,
        color: v.fg,
        border: `1px solid ${v.bd}`,
        borderRadius: s.r,
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

// ---------- IconButton ----------
function IconButton({ icon, onClick, label, active, size = 28, style = {} }) {
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

// ---------- AgentBadge — the small tag that says "this UI was triggered by an agent" ----------
function AgentBadge({ agent = "Agent", action }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "5px 10px 5px 8px",
        fontSize: 11.5,
        fontFamily: "var(--font-mono)",
        color: "var(--agent-ui-accent)",
        background: "color-mix(in oklch, var(--agent-ui-accent) 10%, transparent)",
        border: "1px solid color-mix(in oklch, var(--agent-ui-accent) 28%, transparent)",
        borderRadius: 999,
        letterSpacing: -0.1,
      }}
    >
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

// ---------- ModalShell — the standard chrome wrapped around every component ----------
function ModalShell({ children, width = 620, accent = "var(--agent-ui-accent)", footer, header, onClose, dim = true, style = {} }) {
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
      {/* Accent rail */}
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

// ---------- ResultToast — fired after submit/cancel/edit ----------
function ResultToast({ result, onDismiss }) {
  React.useEffect(() => {
    if (!result) return;
    const t = setTimeout(onDismiss, 4500);
    return () => clearTimeout(t);
  }, [result, onDismiss]);

  if (!result) return null;
  const tone = result.kind === "submit" ? "ok" : result.kind === "edit" ? "accent" : "default";
  const label =
    result.kind === "submit" ? "result.kind = 'submit'" :
    result.kind === "edit"   ? "result.kind = 'edit'" :
                                "result.kind = 'cancel'";
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: 28,
        transform: "translateX(-50%)",
        zIndex: 1000,
        animation: "rise-in .35s cubic-bezier(.2,.9,.2,1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 12px 10px 14px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 999,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--fg-muted)",
          boxShadow: "0 12px 32px -10px rgb(0 0 0 / .5)",
          minWidth: 320,
        }}
      >
        <Pill tone={tone} size="sm">{label}</Pill>
        <span style={{ color: "var(--fg-dim)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {result.summary}
        </span>
        <button onClick={onDismiss} style={{ color: "var(--fg-faint)", display: "inline-flex" }} aria-label="dismiss">
          <Icon.X size={14} />
        </button>
      </div>
    </div>
  );
}

// ---------- CopyButton ----------
function CopyButton({ value, label = "Copy", style = {} }) {
  const [copied, setCopied] = React.useState(false);
  const onClick = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={onClick}
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
      aria-label={label}
    >
      {copied ? <Icon.Check size={13} /> : <Icon.Copy size={13} />}
      <span>{copied ? "copied" : label}</span>
    </button>
  );
}

// ---------- InstallCommand ----------
function InstallCommand({ name, style = {} }) {
  const cmd = `npx agent-ui add ${name}`;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        background: "var(--bg-inset)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        overflow: "hidden",
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        ...style,
      }}
    >
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

// ---------- Field ----------
function Field({ label, hint, children, style = {} }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && (
        <span style={{
          fontSize: 11.5, fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          color: "var(--fg-faint)",
        }}>
          {label}
        </span>
      )}
      {children}
      {hint && <span style={{ fontSize: 11, color: "var(--fg-faint)" }}>{hint}</span>}
    </label>
  );
}

// ---------- TextInput ----------
function TextInput({ value, onChange, placeholder, style = {}, autoFocus, onKeyDown }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <input
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      onKeyDown={onKeyDown}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        height: 36,
        padding: "0 12px",
        background: "var(--bg-inset)",
        border: `1px solid ${focus ? "color-mix(in oklch, var(--agent-ui-accent) 60%, var(--border))" : "var(--border)"}`,
        boxShadow: focus ? `0 0 0 3px color-mix(in oklch, var(--agent-ui-accent) 18%, transparent)` : "none",
        borderRadius: 8,
        fontSize: 13.5,
        outline: "none",
        transition: "border-color .12s, box-shadow .12s",
        ...style,
      }}
    />
  );
}

// ---------- Dot ----------
function Dot({ color = "var(--fg-faint)", size = 5 }) {
  return <span style={{
    display: "inline-block", width: size, height: size, borderRadius: 999, background: color,
    flexShrink: 0,
  }} />;
}

// ---------- KBD ----------
function Kbd({ children }) {
  return (
    <kbd style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      minWidth: 18, height: 18,
      padding: "0 4px",
      fontFamily: "var(--font-mono)", fontSize: 10.5,
      color: "var(--fg-muted)",
      background: "var(--bg-inset)",
      border: "1px solid var(--border)",
      borderRadius: 4,
      lineHeight: 1,
    }}>{children}</kbd>
  );
}

Object.assign(window, {
  cx, Avatar, Pill, Button, IconButton, AgentBadge, ModalShell, ResultToast,
  CopyButton, InstallCommand, Field, TextInput, Dot, Kbd, hashHue,
});


// ============================================================
// components/email-compose.jsx
// ============================================================
// EmailCompose — review-and-send email modal for an agent action.
// Original chrome — coral accent, mono header, minimal toolbar.

const EMAIL_DEFAULT = {
  agent: "atlas",
  action: "send-email",
  to: ["maya.okafor@nordlight.studio"],
  cc: [],
  subject: "Re: Q3 partnership terms",
  body: `Hi Maya,

Quick follow-up on the partnership terms we discussed Tuesday. I've folded in the revised licensing window (24 months) and the joint-attribution clause from your last redline.

Two open items I wanted your sign-off on before we send this to legal:

  1. Royalty split on derivative work — currently 60/40, your team proposed 55/45.
  2. Termination notice — we have it at 90 days; happy to come down to 60 if that's a deal-breaker.

I can hop on a call Thursday afternoon if it's easier to talk through these.

Best,
Theo`,
  tone: "warm",
  rationale: "Replied to the most recent thread in your inbox where Maya asked for an updated draft. Tone matched to your prior reply.",
};

function EmailCompose({ intent = EMAIL_DEFAULT, onResult }) {
  const [to, setTo] = React.useState(intent.to);
  const [subject, setSubject] = React.useState(intent.subject);
  const [body, setBody] = React.useState(intent.body);
  const [edited, setEdited] = React.useState(false);
  const [showCc, setShowCc] = React.useState(intent.cc.length > 0);
  const [cc, setCc] = React.useState(intent.cc);
  const [removingPill, setRemovingPill] = React.useState(null);

  const original = React.useRef({ to: intent.to, subject: intent.subject, body: intent.body });
  React.useEffect(() => {
    setEdited(
      JSON.stringify(to) !== JSON.stringify(original.current.to) ||
      subject !== original.current.subject ||
      body !== original.current.body
    );
  }, [to, subject, body]);

  const submit = () => {
    onResult?.({
      kind: edited ? "edit" : "submit",
      payload: { to, cc, subject, body },
      summary: `Email → ${to[0]}${to.length > 1 ? ` +${to.length - 1}` : ""} · "${subject.slice(0, 32)}${subject.length > 32 ? "…" : ""}"`,
    });
  };
  const cancel = () => onResult?.({ kind: "cancel", summary: "Email send cancelled" });

  const removeRecipient = (i) => {
    setRemovingPill(i);
    setTimeout(() => {
      setTo(to.filter((_, idx) => idx !== i));
      setRemovingPill(null);
    }, 140);
  };

  return (
    <ModalShell
      width={620}
      accent="var(--c-mail)"
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)",
          gap: 12,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <div style={{ flex: 1 }} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--fg-faint)",
          }}>
            review · then send
          </span>
          <button
            onClick={cancel}
            aria-label="Close"
            style={{
              width: 26, height: 26, borderRadius: 6,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              color: "var(--fg-dim)",
            }}
          >
            <Icon.X size={15} />
          </button>
        </div>
      }
      footer={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderTop: "1px solid var(--border)",
          background: "color-mix(in oklch, var(--bg-inset) 60%, transparent)",
          gap: 10,
        }}>
          <div style={{ display: "flex", gap: 4, color: "var(--fg-dim)" }}>
            <IconButton icon={<Icon.Paperclip size={15} />} label="Attach" />
            <IconButton icon={<Icon.Image size={15} />} label="Image" />
            <IconButton icon={<Icon.Smile size={15} />} label="Emoji" />
          </div>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Icon.Send size={13} />}
            onClick={submit}
          >
            {edited ? "Send edited" : "Send"}
            <span style={{ marginLeft: 6, opacity: .55 }}>
              <Kbd>⌘</Kbd>
              <span style={{ marginLeft: 2 }}><Kbd>↵</Kbd></span>
            </span>
          </Button>
        </div>
      }
    >
      {/* Rationale strip */}
      {intent.rationale && (
        <div style={{
          display: "flex", gap: 10,
          padding: "12px 16px",
          background: "color-mix(in oklch, var(--c-mail) 6%, transparent)",
          borderBottom: "1px solid var(--border-faint)",
          fontSize: 12.5,
          color: "var(--fg-muted)",
          lineHeight: 1.5,
        }}>
          <Icon.Sparkles size={14} style={{ color: "var(--c-mail)", marginTop: 2, flexShrink: 0 }} />
          <span>{intent.rationale}</span>
        </div>
      )}

      {/* Header rows */}
      <div style={{ padding: "4px 16px" }}>
        <HeaderRow label="To" first>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, flex: 1, alignItems: "center" }}>
            {to.map((r, i) => (
              <RecipientPill
                key={r}
                value={r}
                onRemove={() => removeRecipient(i)}
                fading={removingPill === i}
              />
            ))}
            <input
              placeholder={to.length ? "" : "name@company.com"}
              onKeyDown={e => {
                if (e.key === "Enter" && e.currentTarget.value) {
                  setTo([...to, e.currentTarget.value]);
                  e.currentTarget.value = "";
                }
              }}
              style={{
                flex: 1, minWidth: 100,
                background: "transparent", border: 0, outline: 0,
                fontSize: 13.5, color: "var(--fg)",
                height: 28,
              }}
            />
            {!showCc && (
              <button
                onClick={() => setShowCc(true)}
                style={{ fontSize: 12, color: "var(--fg-faint)", padding: "0 4px" }}
              >Cc</button>
            )}
          </div>
        </HeaderRow>

        {showCc && (
          <HeaderRow label="Cc">
            <input
              value={cc.join(", ")}
              onChange={e => setCc(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
              placeholder="cc@company.com"
              style={{
                flex: 1, background: "transparent", border: 0, outline: 0,
                fontSize: 13.5, color: "var(--fg)", height: 32,
              }}
            />
          </HeaderRow>
        )}

        <HeaderRow label="Subject">
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            style={{
              flex: 1, background: "transparent", border: 0, outline: 0,
              fontSize: 14, color: "var(--fg)", fontWeight: 500, height: 32,
            }}
          />
        </HeaderRow>
      </div>

      {/* Format toolbar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 2,
        padding: "6px 12px",
        borderTop: "1px solid var(--border-faint)",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        {[Icon.Bold, Icon.Italic, Icon.Link, Icon.List, Icon.Code].map((I, i) => (
          <IconButton key={i} icon={<I size={14} />} label="format" />
        ))}
        <div style={{ flex: 1 }} />
        <Pill size="xs" tone="default" icon={<Icon.Sparkles size={10} />}>
          tone: {intent.tone}
        </Pill>
      </div>

      {/* Body */}
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        rows={12}
        style={{
          width: "100%",
          padding: "16px 16px 18px",
          background: "var(--bg-card)",
          border: 0, outline: 0,
          fontSize: 13.5,
          fontFamily: "var(--font-sans)",
          color: "var(--fg)",
          lineHeight: 1.55,
          minHeight: 220,
          display: "block",
        }}
      />
    </ModalShell>
  );
}

function HeaderRow({ label, children, first }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "6px 0",
      borderTop: first ? "none" : "1px solid var(--border-faint)",
    }}>
      <span style={{
        width: 52,
        fontSize: 11, fontWeight: 500,
        textTransform: "uppercase", letterSpacing: 0.6,
        color: "var(--fg-faint)",
      }}>{label}</span>
      {children}
    </div>
  );
}

function RecipientPill({ value, onRemove, fading }) {
  const name = value.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        height: 24, padding: "0 4px 0 4px",
        background: "var(--bg-inset)",
        border: "1px solid var(--border)",
        borderRadius: 999,
        fontSize: 12,
        color: "var(--fg)",
        opacity: fading ? 0 : 1,
        transform: fading ? "scale(.92)" : "scale(1)",
        transition: "opacity .14s, transform .14s",
      }}
    >
      <Avatar name={name} size={18} />
      <span>{name}</span>
      <span style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
        {value.split("@")[1]}
      </span>
      <button
        onClick={onRemove}
        aria-label={`remove ${value}`}
        style={{
          width: 18, height: 18, borderRadius: 999,
          color: "var(--fg-faint)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <Icon.X size={11} />
      </button>
    </span>
  );
}

window.EmailCompose = EmailCompose;
window.EMAIL_DEFAULT = EMAIL_DEFAULT;


// ============================================================
// components/slack-message.jsx
// ============================================================
// SlackMessage — channel message review.
// Original chrome — teal accent, mention-aware, channel context preview.

const SLACK_DEFAULT = {
  agent: "atlas",
  action: "post-message",
  workspace: "nordlight",
  channel: "eng-platform",
  thread: {
    parent: {
      author: "Priya Raman",
      time: "11:42",
      text: "Heads up — the auth gateway p99 is back over 800ms since the deploy this morning. Tracing it now.",
    },
    replies: 4,
  },
  mentions: ["@priya", "@on-call"],
  message: "Pulled the flame graph — looks like the new JWT library is doing a synchronous `crypto.verify` per request instead of caching the public key. Patch ready in #4187, can someone with merge rights take a look?",
  rationale: "Detected an unresolved p99 latency thread you were tagged on. Drafted a reply with the root-cause analysis from your local profiling run.",
};

function SlackMessage({ intent = SLACK_DEFAULT, onResult }) {
  const [message, setMessage] = React.useState(intent.message);
  const [edited, setEdited] = React.useState(false);
  const [broadcast, setBroadcast] = React.useState(false);

  React.useEffect(() => setEdited(message !== intent.message), [message]);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { channel: intent.channel, message, broadcast },
    summary: `#${intent.channel} · ${message.slice(0, 48)}${message.length > 48 ? "…" : ""}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: `Slack post to #${intent.channel} cancelled` });

  return (
    <ModalShell
      width={580}
      accent="var(--c-slack)"
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)",
          gap: 12,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <div style={{ flex: 1 }} />
          <button onClick={cancel} aria-label="Close" style={{ color: "var(--fg-dim)" }}>
            <Icon.X size={15} />
          </button>
        </div>
      }
      footer={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderTop: "1px solid var(--border)",
          background: "color-mix(in oklch, var(--bg-inset) 60%, transparent)",
          gap: 10,
        }}>
          <label style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 12, color: "var(--fg-muted)", cursor: "pointer",
          }}>
            <input
              type="checkbox"
              checked={broadcast}
              onChange={e => setBroadcast(e.target.checked)}
              style={{ accentColor: "var(--c-slack)" }}
            />
            <span>Also send to #{intent.channel}</span>
          </label>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Icon.Send size={13} />}
            onClick={submit}
          >
            {edited ? "Send edit" : "Send reply"}
          </Button>
        </div>
      }
    >
      {/* Workspace bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 16px",
        background: "color-mix(in oklch, var(--c-slack) 6%, transparent)",
        borderBottom: "1px solid var(--border-faint)",
        fontSize: 12.5,
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          background: "var(--c-slack)",
          color: "var(--bg)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 12, fontFamily: "var(--font-mono)",
        }}>{intent.workspace[0].toUpperCase()}</div>
        <span style={{ color: "var(--fg-muted)" }}>{intent.workspace}</span>
        <span style={{ color: "var(--fg-faint)" }}>/</span>
        <Icon.Hash size={13} style={{ color: "var(--fg-faint)" }} />
        <span style={{ color: "var(--fg)", fontWeight: 500 }}>{intent.channel}</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: "var(--fg-faint)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
          replying in thread
        </span>
      </div>

      {/* Thread parent */}
      <div style={{
        padding: "14px 16px 10px",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <div style={{ display: "flex", gap: 10 }}>
          <Avatar name={intent.thread.parent.author} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 13.5 }}>{intent.thread.parent.author}</span>
              <span style={{ fontSize: 11, color: "var(--fg-faint)" }}>{intent.thread.parent.time}</span>
            </div>
            <div style={{
              fontSize: 13.5, color: "var(--fg-muted)", lineHeight: 1.5, marginTop: 2,
            }}>
              {intent.thread.parent.text}
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
              <Pill size="xs" tone="default">💬 {intent.thread.replies} replies</Pill>
            </div>
          </div>
        </div>
      </div>

      {/* Rationale */}
      {intent.rationale && (
        <div style={{
          display: "flex", gap: 10,
          padding: "10px 16px",
          fontSize: 12,
          color: "var(--fg-muted)",
          background: "color-mix(in oklch, var(--c-slack) 4%, transparent)",
          borderBottom: "1px solid var(--border-faint)",
        }}>
          <Icon.Sparkles size={13} style={{ color: "var(--c-slack)", marginTop: 2, flexShrink: 0 }} />
          <span>{intent.rationale}</span>
        </div>
      )}

      {/* Compose area */}
      <div style={{ padding: "14px 16px" }}>
        <div style={{
          border: "1px solid var(--border)",
          borderRadius: 10,
          background: "var(--bg-inset)",
          overflow: "hidden",
        }}>
          <SlackTextarea value={message} onChange={setMessage} mentions={intent.mentions} />
          <div style={{
            display: "flex", alignItems: "center", gap: 2,
            padding: "6px 8px",
            borderTop: "1px solid var(--border-faint)",
            color: "var(--fg-dim)",
          }}>
            <IconButton icon={<Icon.Bold size={13} />} label="bold" />
            <IconButton icon={<Icon.Italic size={13} />} label="italic" />
            <IconButton icon={<Icon.Code size={13} />} label="code" />
            <IconButton icon={<Icon.Link size={13} />} label="link" />
            <IconButton icon={<Icon.AtSign size={13} />} label="mention" />
            <IconButton icon={<Icon.Smile size={13} />} label="emoji" />
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)", marginRight: 6 }}>
              {message.length} chars
            </span>
          </div>
        </div>

        {/* Mentions chips */}
        {intent.mentions?.length > 0 && (
          <div style={{ marginTop: 10, display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>mentions →</span>
            {intent.mentions.map(m => (
              <Pill key={m} size="xs" tone="default">
                <span style={{ color: "var(--c-slack)" }}>{m}</span>
              </Pill>
            ))}
          </div>
        )}
      </div>
    </ModalShell>
  );
}

function SlackTextarea({ value, onChange, mentions = [] }) {
  // Highlights @-mentions as you type by overlaying a styled mirror.
  // Not perfect, but no contenteditable footguns.
  const ref = React.useRef(null);
  return (
    <div style={{ position: "relative" }}>
      <textarea
        ref={ref}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={5}
        style={{
          width: "100%",
          padding: "12px 14px",
          background: "transparent",
          border: 0, outline: 0,
          fontSize: 13.5, fontFamily: "var(--font-sans)",
          color: "var(--fg)",
          lineHeight: 1.55,
          display: "block",
          minHeight: 110,
        }}
      />
    </div>
  );
}

window.SlackMessage = SlackMessage;
window.SLACK_DEFAULT = SLACK_DEFAULT;


// ============================================================
// components/linear-issue.jsx
// ============================================================
// LinearIssue — issue creation review.
// Original chrome — violet accent, side panel layout with metadata.

const LINEAR_DEFAULT = {
  agent: "atlas",
  action: "create-issue",
  team: "PLAT",
  identifier: "PLAT-241",
  title: "JWT verification blocks event loop on auth gateway hot path",
  description: `## Context
Production p99 on the auth gateway has been over 800ms since the 09:14 UTC deploy. Profiling shows the new \`@nl/jwt\` library calls \`crypto.verify\` synchronously on every request without caching the public key.

## Repro
\`\`\`
ab -n 5000 -c 50 https://auth.nordlight.cloud/verify
\`\`\`

## Proposed fix
Cache the resolved public key in module scope, keyed by \`kid\`. PR #4187 has the patch + a regression test.`,
  priority: "Urgent",
  status: "Triage",
  labels: ["performance", "auth-gateway"],
  assignee: { name: "Priya Raman", role: "on-call" },
  estimate: 2,
  cycle: "Cycle 23",
  related: ["PLAT-198"],
  rationale: "Tied to the active incident in #eng-platform. Pulled stack frame and PR link from your local profiling session.",
};

const PRIORITIES = [
  { id: "No", label: "No priority", color: "var(--fg-faint)", glyph: "—" },
  { id: "Low",    label: "Low",    color: "oklch(0.70 0.10 220)", glyph: "▁" },
  { id: "Med", label: "Medium", color: "oklch(0.78 0.13 95)",  glyph: "▂▃" },
  { id: "High",   label: "High",   color: "oklch(0.74 0.15 50)",  glyph: "▂▃▄" },
  { id: "Urgent", label: "Urgent", color: "var(--c-err)",         glyph: "!" },
];

function LinearIssue({ intent = LINEAR_DEFAULT, onResult }) {
  const [title, setTitle] = React.useState(intent.title);
  const [description, setDescription] = React.useState(intent.description);
  const [priority, setPriority] = React.useState(intent.priority);
  const [labels, setLabels] = React.useState(intent.labels);
  const [edited, setEdited] = React.useState(false);

  React.useEffect(() => {
    setEdited(
      title !== intent.title ||
      description !== intent.description ||
      priority !== intent.priority ||
      JSON.stringify(labels) !== JSON.stringify(intent.labels)
    );
  }, [title, description, priority, labels]);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { title, description, priority, labels },
    summary: `${intent.identifier} · ${title.slice(0, 56)}${title.length > 56 ? "…" : ""}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: `Issue ${intent.identifier} cancelled` });

  const prio = PRIORITIES.find(p => p.id === priority) || PRIORITIES[0];

  return (
    <ModalShell
      width={760}
      accent="var(--c-linear)"
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)",
          gap: 12,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11.5,
            color: "var(--c-linear)",
            padding: "3px 8px",
            border: "1px solid color-mix(in oklch, var(--c-linear) 30%, transparent)",
            background: "color-mix(in oklch, var(--c-linear) 10%, transparent)",
            borderRadius: 6,
          }}>
            {intent.identifier}
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
            new issue · {intent.team}
          </span>
          <button onClick={cancel} aria-label="Close" style={{ color: "var(--fg-dim)" }}>
            <Icon.X size={15} />
          </button>
        </div>
      }
      footer={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderTop: "1px solid var(--border)",
          background: "color-mix(in oklch, var(--bg-inset) 60%, transparent)",
          gap: 10,
        }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
            <Kbd>⌘</Kbd> <Kbd>↵</Kbd> to submit · <Kbd>esc</Kbd> to cancel
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Discard</Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Icon.Plus size={13} />}
            onClick={submit}
          >
            {edited ? "Create edited issue" : "Create issue"}
          </Button>
        </div>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", minHeight: 380 }}>
        {/* Main column */}
        <div style={{
          padding: "18px 18px 18px 22px",
          borderRight: "1px solid var(--border-faint)",
        }}>
          {/* Title */}
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Issue title"
            style={{
              width: "100%",
              background: "transparent",
              border: 0, outline: 0,
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: -0.2,
              color: "var(--fg)",
              padding: "2px 0",
              marginBottom: 8,
            }}
          />

          {/* Rationale */}
          {intent.rationale && (
            <div style={{
              display: "flex", gap: 8,
              padding: "10px 12px",
              background: "color-mix(in oklch, var(--c-linear) 6%, transparent)",
              border: "1px solid color-mix(in oklch, var(--c-linear) 20%, transparent)",
              borderRadius: 8,
              fontSize: 12.5,
              color: "var(--fg-muted)",
              margin: "8px 0 14px",
              lineHeight: 1.5,
            }}>
              <Icon.Sparkles size={13} style={{ color: "var(--c-linear)", marginTop: 2, flexShrink: 0 }} />
              <span>{intent.rationale}</span>
            </div>
          )}

          {/* Description (markdown-ish textarea) */}
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={12}
            placeholder="Add description… markdown supported"
            style={{
              width: "100%",
              background: "transparent",
              border: 0, outline: 0,
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              color: "var(--fg-muted)",
              lineHeight: 1.6,
              padding: "4px 0",
              minHeight: 200,
            }}
          />
        </div>

        {/* Side panel */}
        <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 14 }}>
          <SidePanelRow icon={<Icon.AlertTriangle size={13} />} label="Priority">
            <PrioritySelect value={priority} onChange={setPriority} />
          </SidePanelRow>

          <SidePanelRow icon={<Icon.Layers size={13} />} label="Status">
            <StatusBadge status={intent.status} />
          </SidePanelRow>

          <SidePanelRow icon={<Icon.User size={13} />} label="Assignee">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Avatar name={intent.assignee.name} size={20} />
              <span style={{ fontSize: 12.5 }}>{intent.assignee.name}</span>
            </div>
          </SidePanelRow>

          <SidePanelRow icon={<Icon.Tag size={13} />} label="Labels">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {labels.map(l => (
                <button
                  key={l}
                  onClick={() => setLabels(labels.filter(x => x !== l))}
                  style={{
                    fontSize: 11,
                    padding: "2px 8px 2px 8px",
                    background: "var(--bg-inset)",
                    border: "1px solid var(--border)",
                    borderRadius: 999,
                    color: "var(--fg-muted)",
                    fontFamily: "var(--font-mono)",
                    display: "inline-flex", alignItems: "center", gap: 4,
                  }}
                >
                  <Dot color={`oklch(0.70 0.13 ${hashHue(l)})`} />
                  {l}
                </button>
              ))}
              <button style={{
                fontSize: 11,
                width: 22, height: 22,
                background: "transparent",
                border: "1px dashed var(--border-strong)",
                borderRadius: 999,
                color: "var(--fg-faint)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon.Plus size={11} />
              </button>
            </div>
          </SidePanelRow>

          <SidePanelRow icon={<Icon.Calendar size={13} />} label="Cycle">
            <span style={{ fontSize: 12.5, color: "var(--fg-muted)" }}>{intent.cycle}</span>
          </SidePanelRow>

          <SidePanelRow icon={<Icon.Flag size={13} />} label="Estimate">
            <div style={{ display: "inline-flex", gap: 2 }}>
              {[1,2,3,5,8].map(n => (
                <span key={n} style={{
                  width: 16, height: 16, borderRadius: 4,
                  fontSize: 10, fontFamily: "var(--font-mono)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  background: n === intent.estimate ? "var(--fg)" : "var(--bg-inset)",
                  color: n === intent.estimate ? "var(--bg)" : "var(--fg-faint)",
                  border: `1px solid ${n === intent.estimate ? "var(--fg)" : "var(--border)"}`,
                }}>{n}</span>
              ))}
            </div>
          </SidePanelRow>

          <div style={{ flex: 1 }} />

          {intent.related?.length > 0 && (
            <div style={{
              fontSize: 11, color: "var(--fg-faint)",
              fontFamily: "var(--font-mono)",
              borderTop: "1px solid var(--border-faint)",
              paddingTop: 12,
            }}>
              <div style={{ marginBottom: 6 }}>related</div>
              {intent.related.map(r => (
                <div key={r} style={{ color: "var(--c-linear)", fontSize: 11.5 }}>{r}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

function SidePanelRow({ icon, label, children }) {
  return (
    <div>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        fontSize: 10.5, color: "var(--fg-faint)",
        textTransform: "uppercase", letterSpacing: 0.6,
        fontWeight: 500,
        marginBottom: 6,
      }}>
        {icon}
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

function PrioritySelect({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const cur = PRIORITIES.find(p => p.id === value) || PRIORITIES[0];
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          height: 26, padding: "0 8px",
          background: "var(--bg-inset)",
          border: "1px solid var(--border)",
          borderRadius: 6,
          fontSize: 12.5,
          color: cur.color,
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, width: 16, textAlign: "center" }}>
          {cur.glyph}
        </span>
        <span style={{ color: "var(--fg)" }}>{cur.label}</span>
        <Icon.ChevronDown size={12} style={{ color: "var(--fg-faint)" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0,
          minWidth: 180,
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: 4,
          zIndex: 10,
          boxShadow: "0 12px 30px -8px rgb(0 0 0 / .55)",
        }}>
          {PRIORITIES.map(p => (
            <button
              key={p.id}
              onClick={() => { onChange(p.id); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                width: "100%", padding: "6px 8px",
                fontSize: 12.5,
                color: "var(--fg)",
                background: p.id === value ? "var(--bg-inset)" : "transparent",
                borderRadius: 6,
                textAlign: "left",
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: p.color, width: 16, textAlign: "center" }}>{p.glyph}</span>
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      height: 24, padding: "0 8px",
      background: "var(--bg-inset)",
      border: "1px solid var(--border)",
      borderRadius: 6,
      fontSize: 12.5,
      color: "var(--fg)",
    }}>
      <span style={{
        width: 10, height: 10, borderRadius: 999,
        border: "1.5px dashed var(--c-warn)",
      }} />
      {status}
    </span>
  );
}

window.LinearIssue = LinearIssue;
window.LINEAR_DEFAULT = LINEAR_DEFAULT;


// ============================================================
// components/hero.jsx
// ============================================================
// Hero — terminal typing on the left, component materializing on the right.

const HERO_LINES = [
  { kind: "prompt", text: "npx agent-ui add email-compose" },
  { kind: "out",    text: "✔ Resolved registry → components/agent-ui/" },
  { kind: "out",    text: "✔ Wrote email-compose/index.tsx (412 LOC)" },
  { kind: "out",    text: "✔ Wrote email-compose/types.ts" },
  { kind: "out",    text: "✔ Installed peer deps: lucide-react, framer-motion" },
  { kind: "ok",     text: "ready · import { EmailCompose } from \"@/components/agent-ui/email-compose\"" },
];

function Hero({ onBrowse, onOpenPalette }) {
  const [step, setStep] = React.useState(0);
  const [typed, setTyped] = React.useState("");
  const cmd = HERO_LINES[0].text;

  // Type the prompt
  React.useEffect(() => {
    if (step !== 0) return;
    if (typed.length < cmd.length) {
      const t = setTimeout(() => setTyped(cmd.slice(0, typed.length + 1)), 38);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep(1), 350);
    return () => clearTimeout(t);
  }, [typed, step]);

  // Cascade through the rest
  React.useEffect(() => {
    if (step === 0) return;
    if (step >= HERO_LINES.length) return;
    const delays = [0, 240, 360, 380, 520, 360];
    const t = setTimeout(() => setStep(s => s + 1), delays[step] || 320);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <section style={{
      paddingTop: 72,
      paddingBottom: 80,
      borderBottom: "1px solid var(--border)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtle grid bg */}
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
        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            height: 24, padding: "0 10px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 999,
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

        {/* Headline */}
        <h1 style={{
          fontSize: 78,
          lineHeight: 0.98,
          letterSpacing: -2.5,
          fontWeight: 600,
          margin: 0,
          maxWidth: 980,
          textWrap: "pretty",
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
            “send it?”
          </span>
        </h1>

        <p style={{
          marginTop: 22,
          maxWidth: 640,
          fontSize: 18,
          lineHeight: 1.5,
          color: "var(--fg-muted)",
          textWrap: "pretty",
        }}>
          A copy-paste registry of review-and-edit components for AI agent surfaces — emails, messages, issues, queries, patches. No runtime, no provider, no protocol.{" "}
          <span style={{ color: "var(--fg)" }}>Just components you own.</span>
        </p>

        {/* CTA row */}
        <div style={{ marginTop: 28, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <Button
            variant="primary"
            size="lg"
            iconRight={<Icon.ArrowRight size={15} />}
            onClick={onBrowse}
          >
            Browse components
          </Button>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <Button variant="default" size="lg" icon={<Icon.GitHub size={15} />}>
              agent-ui on GitHub
            </Button>
          </a>
          <button
            onClick={onOpenPalette}
            aria-label="Open command palette"
            style={{
              marginLeft: 8, fontSize: 12.5, fontFamily: "var(--font-mono)",
              color: "var(--fg-faint)", display: "inline-flex", alignItems: "center", gap: 6,
              background: "transparent", border: 0, cursor: "pointer",
            }}
          >
            <Kbd>⌘</Kbd> <Kbd>K</Kbd> &nbsp;to search
          </button>
        </div>

        {/* Demo grid */}
        <div style={{
          marginTop: 64,
          display: "grid",
          gridTemplateColumns: "minmax(0, 460px) 1fr",
          gap: 32,
          alignItems: "start",
        }}>
          {/* Terminal */}
          <Terminal lines={HERO_LINES} step={step} typed={typed} />

          {/* Live component */}
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", top: -10, left: 24,
              fontSize: 10.5, fontFamily: "var(--font-mono)",
              color: "var(--fg-faint)",
              padding: "0 6px",
              background: "var(--bg)",
              letterSpacing: 0.4,
              textTransform: "uppercase",
            }}>
              live · interact with it
            </div>
            <div style={{
              border: "1px dashed var(--border-strong)",
              borderRadius: 14,
              padding: 24,
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

function Terminal({ lines, step, typed }) {
  return (
    <div style={{
      background: "oklch(0.11 0.005 80)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      overflow: "hidden",
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
              {ln.kind === "prompt" && (
                <span style={{ color: "var(--agent-ui-accent)" }}>›</span>
              )}
              {ln.kind === "out" && (
                <span style={{ color: "var(--c-ok)", width: 14, flexShrink: 0 }}>✓</span>
              )}
              {ln.kind === "ok" && (
                <span style={{ color: "var(--agent-ui-accent)", width: 14, flexShrink: 0 }}>★</span>
              )}
              <span style={{
                color: ln.kind === "prompt" ? "var(--fg)"
                  : ln.kind === "ok" ? "var(--fg)"
                  : "var(--fg-muted)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
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

// Compact hero version of the email modal — same component, smaller frame.
function HeroEmail() {
  const [result, setResult] = React.useState(null);
  return (
    <div style={{ animation: "rise-in .6s cubic-bezier(.2,.9,.2,1)" }}>
      <EmailCompose
        intent={EMAIL_DEFAULT}
        onResult={setResult}
      />
      <ResultToast result={result} onDismiss={() => setResult(null)} />
    </div>
  );
}

window.Hero = Hero;


// ============================================================
// components/browser.jsx
// ============================================================
// Browser — shadcn-style component grid + a "showcase" detail section per component.

const REGISTRY = [
  {
    id: "email-compose",
    name: "email-compose",
    title: "Email compose",
    accent: "var(--c-mail)",
    summary: "Review and edit an email before the agent sends it. Address pills, tone hint, send keystroke.",
    deps: ["lucide-react"],
    loc: 412,
    component: "EmailCompose",
    status: "stable",
  },
  {
    id: "slack-message",
    name: "slack-message",
    title: "Slack message",
    accent: "var(--c-slack)",
    summary: "Reply in a thread or post to a channel. Mention chips, broadcast toggle, parent-message context.",
    deps: ["lucide-react"],
    loc: 286,
    component: "SlackMessage",
    status: "stable",
  },
  {
    id: "linear-issue",
    name: "linear-issue",
    title: "Linear issue",
    accent: "var(--c-linear)",
    summary: "Triage-shaped issue creation. Priority, labels, estimate, side panel — all editable inline.",
    deps: ["lucide-react"],
    loc: 374,
    component: "LinearIssue",
    status: "stable",
  },
  // Roadmap placeholders
  { id: "github-pr-review", name: "github-pr-review", title: "GitHub PR review", summary: "Approve, comment, or request changes on a PR diff.", status: "soon", accent: "oklch(0.78 0.06 280)" },
  { id: "sql-query-runner", name: "sql-query-runner", title: "SQL query runner", summary: "Approve a query before it hits prod. Schema awareness, dry-run preview.", status: "soon", accent: "oklch(0.74 0.10 200)" },
  { id: "file-patch-preview", name: "file-patch-preview", title: "File patch preview", summary: "Inline diff with approve / reject / edit-in-place per hunk.", status: "soon", accent: "oklch(0.78 0.10 145)" },
  { id: "calendar-event", name: "calendar-event", title: "Calendar event", summary: "Confirm a meeting before it's scheduled. Attendee resolution, conflict warnings.", status: "soon", accent: "oklch(0.74 0.12 60)" },
  { id: "github-issue", name: "github-issue", title: "GitHub issue", summary: "File a GitHub issue with labels, assignee, and milestone.", status: "soon", accent: "oklch(0.78 0.04 280)" },
  { id: "sms-message", name: "sms-message", title: "SMS message", summary: "Approve a text message. Carrier preview, delivery window.", status: "soon", accent: "oklch(0.78 0.10 320)" },
];

function Browser({ onPick }) {
  return (
    <section id="browser" style={{ padding: "80px 0", borderBottom: "1px solid var(--border)" }}>
      <div className="wrap">
        <SectionHeader
          eyebrow="components/"
          title="Ten components you wish you didn't have to build."
          subtitle="Run one command. The source lands in your repo. You own it from there."
        />

        <div style={{
          marginTop: 40,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}>
          {REGISTRY.map(c => (
            <ComponentCard key={c.id} c={c} onPick={onPick} />
          ))}
        </div>

        <div style={{
          marginTop: 28,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          fontSize: 12.5,
          color: "var(--fg-muted)",
          fontFamily: "var(--font-mono)",
        }}>
          <span>{REGISTRY.filter(r => r.status === "stable").length} stable · {REGISTRY.filter(r => r.status === "soon").length} on the way</span>
          <a
            href={REPO_URL + "/issues/new?labels=component-request&template=component-request.md"}
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

function ComponentCard({ c, onPick }) {
  const [hover, setHover] = React.useState(false);
  const isStable = c.status === "stable";
  // Use a real anchor so right-click → "copy link" works for shareable URLs.
  const Tag = isStable ? "a" : "div";
  const tagProps = isStable
    ? {
        href: "#" + c.id,
        onClick: (e) => { e.preventDefault(); onPick?.(c.id); },
      }
    : {};
  return (
    <Tag
      {...tagProps}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block",
        textAlign: "left",
        padding: 0,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        overflow: "hidden",
        cursor: isStable ? "pointer" : "default",
        transition: "transform .14s ease, border-color .14s ease",
        transform: hover && isStable ? "translateY(-2px)" : "none",
        borderColor: hover && isStable ? "var(--border-strong)" : "var(--border)",
        opacity: isStable ? 1 : 0.66,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {/* Mini-preview */}
      <div style={{
        height: 132,
        position: "relative",
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
            borderRadius: 4,
            color: "var(--fg-faint)",
            letterSpacing: 0.4,
            textTransform: "uppercase",
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
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {c.summary}
        </div>
      </div>
    </Tag>
  );
}

// Tiny 2D abstract previews keyed off id — domain-evocative shapes, no real chrome.
function CardPreview({ id, accent }) {
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
  // Generic placeholder
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

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div>
      {eyebrow && (
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 12,
          color: "var(--fg-faint)",
          letterSpacing: 0.4,
          marginBottom: 14,
        }}>{eyebrow}</div>
      )}
      <h2 style={{
        fontSize: 42, lineHeight: 1.05,
        fontWeight: 600, letterSpacing: -1,
        margin: 0,
        maxWidth: 760,
        textWrap: "balance",
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

window.Browser = Browser;
window.REGISTRY = REGISTRY;
window.SectionHeader = SectionHeader;


// ============================================================
// components/showcase.jsx
// ============================================================
// Showcase — per-component detail section: live preview + install + code + props table.

const SOURCE_SNIPPETS = {
  "email-compose": `import { EmailCompose, type EmailIntent } from "@/components/agent-ui/email-compose";

export function ApproveEmailStep({ intent, onResolve }: {
  intent: EmailIntent;
  onResolve: (r: ReviewResult) => void;
}) {
  return (
    <EmailCompose
      intent={intent}
      onResult={(result) => {
        // result.kind === 'submit' | 'edit' | 'cancel'
        // edited fields land in result.payload
        onResolve(result);
      }}
    />
  );
}`,

  "slack-message": `import { SlackMessage } from "@/components/agent-ui/slack-message";

<SlackMessage
  intent={{
    workspace: "nordlight",
    channel: "eng-platform",
    thread: { parent, replies: 4 },
    mentions: ["@priya", "@on-call"],
    message: draftFromAgent,
  }}
  onResult={(r) => {
    if (r.kind === "submit") postToSlack(r.payload);
    if (r.kind === "cancel") agent.abort();
  }}
/>`,

  "linear-issue": `import { LinearIssue } from "@/components/agent-ui/linear-issue";

<LinearIssue
  intent={{
    team: "PLAT",
    identifier: nextIssueId,
    title, description, priority: "Urgent",
    labels: ["performance", "auth-gateway"],
    assignee: { name: "Priya Raman" },
  }}
  onResult={(r) => r.kind === "submit"
    ? linear.issues.create(r.payload)
    : agent.continue({ skip: true })
  }
/>`,
};

const PROPS = {
  "email-compose": [
    { name: "intent", type: "EmailIntent", req: true,  desc: "Draft proposed by the agent: to, cc, subject, body, tone, rationale." },
    { name: "onResult", type: "(r: ReviewResult) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
    { name: "tone", type: "'warm' | 'neutral' | 'terse'", req: false, desc: "Shown as a hint chip; doesn't transform copy." },
  ],
  "slack-message": [
    { name: "intent", type: "SlackIntent", req: true, desc: "Workspace, channel, thread parent, draft message, mentions." },
    { name: "onResult", type: "(r: ReviewResult) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
    { name: "thread", type: "{ parent, replies }", req: false, desc: "If present, renders parent context above the composer." },
  ],
  "linear-issue": [
    { name: "intent", type: "LinearIntent", req: true, desc: "Team, identifier, title, description, priority, labels, assignee, estimate." },
    { name: "onResult", type: "(r: ReviewResult) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
    { name: "priority", type: "'No' | 'Low' | 'Med' | 'High' | 'Urgent'", req: false, desc: "Defaults to 'No'. Editable inline." },
  ],
};

function Showcase({ id, onShare }) {
  const c = REGISTRY.find(r => r.id === id);
  if (!c || c.status !== "stable") return null;

  const [tab, setTab] = React.useState("preview");
  const [result, setResult] = React.useState(null);

  const Comp = window[c.component];

  return (
    <section style={{ padding: "80px 0", borderBottom: "1px solid var(--border)" }} id={id}>
      <div className="wrap">
        <div style={{ display: "flex", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              marginBottom: 14,
              padding: "4px 10px",
              border: "1px solid var(--border)",
              borderRadius: 999,
              fontFamily: "var(--font-mono)", fontSize: 11.5,
              color: "var(--fg-muted)",
            }}>
              <Dot color={c.accent} />
              {c.name}
              <span style={{ color: "var(--fg-faint)" }}>·</span>
              <span style={{ color: "var(--fg-faint)" }}>{c.loc} LOC</span>
              <button
                onClick={() => onShare?.(c.id)}
                aria-label={`Copy share link for ${c.title}`}
                style={{
                  marginLeft: 4, padding: "0 4px",
                  display: "inline-flex", alignItems: "center", gap: 4,
                  background: "transparent", border: 0, cursor: "pointer",
                  color: "var(--fg-faint)", font: "inherit",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--fg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--fg-faint)"; }}
              >
                <Icon.Share size={11} />
                <span>share</span>
              </button>
            </div>
            <h3 style={{
              margin: 0, fontSize: 34, fontWeight: 600,
              letterSpacing: -0.8, lineHeight: 1.1,
            }}>{c.title}</h3>
            <p style={{
              marginTop: 10, maxWidth: 520,
              fontSize: 15, lineHeight: 1.55,
              color: "var(--fg-muted)",
            }}>{c.summary}</p>
          </div>
          <InstallCommand name={c.name} style={{ minWidth: 360, maxWidth: 460 }} />
        </div>

        {/* Tabs */}
        <div style={{
          marginTop: 32,
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
              onClick={() => setTab(t.id)}
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

        {/* Tab content */}
        <div style={{
          marginTop: 16,
          minHeight: 480,
        }}>
          {tab === "preview" && <PreviewStage Comp={Comp} setResult={setResult} accent={c.accent} />}
          {tab === "code"    && <CodeBlock code={SOURCE_SNIPPETS[id]} />}
          {tab === "props"   && <PropsTable rows={PROPS[id]} />}
        </div>
      </div>

      <ResultToast result={result} onDismiss={() => setResult(null)} />
    </section>
  );
}

function PreviewStage({ Comp, setResult, accent }) {
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
      {/* dotted bg */}
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

// Real TSX/bash highlighting via Prism (loaded from CDN in index.html).
// Falls back to plaintext if Prism isn't available yet.
function highlightCode(code, lang = "tsx") {
  const Prism = window.Prism;
  if (!Prism || !Prism.languages || !Prism.languages[lang]) {
    // escape so the fallback is at least safe
    return code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  try {
    return Prism.highlight(code, Prism.languages[lang], lang);
  } catch {
    return code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}

function CodeBlock({ code, lang = "tsx", filename = "example.tsx" }) {
  // Render to HTML once per code change. Use innerHTML on a <pre> wrapper.
  const html = React.useMemo(() => highlightCode(code, lang), [code, lang]);
  const lines = code.split("\n");
  // Each line is highlighted independently so the line-number gutter stays aligned.
  // Prism is forgiving across line boundaries for the languages we use here.
  const lineHtml = React.useMemo(
    () => lines.map(line => highlightCode(line === "" ? " " : line, lang)),
    [code, lang],
  );
  return (
    <div style={{
      background: "oklch(0.11 0.005 80)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      overflow: "hidden",
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      lineHeight: 1.7,
    }}>
      <div style={{
        display: "flex", alignItems: "center",
        padding: "10px 14px",
        borderBottom: "1px solid var(--border-faint)",
      }}>
        <span style={{ fontSize: 11.5, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>
          {filename}
        </span>
        <div style={{ flex: 1 }} />
        <CopyButton value={code} label="copy" />
      </div>
      <pre className={`language-${lang}`} style={{
        margin: 0, padding: "16px 18px",
        color: "var(--fg)",
        whiteSpace: "pre",
        overflowX: "auto",
      }}>
        <code className={`language-${lang}`} style={{ display: "block" }}>
          {lineHtml.map((h, i) => (
            <div key={i} style={{ display: "flex", gap: 16 }}>
              <span aria-hidden="true" style={{
                color: "var(--fg-faint)", width: 22, textAlign: "right",
                userSelect: "none", flexShrink: 0,
              }}>{i + 1}</span>
              <span style={{ flex: 1 }} dangerouslySetInnerHTML={{ __html: h }} />
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

function PropsTable({ rows }) {
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

window.Showcase = Showcase;
window.SOURCE_SNIPPETS = SOURCE_SNIPPETS;


// ============================================================
// app.jsx
// ============================================================
// App — top nav, hero, browser grid, three showcases, principles strip, footer.

const REPO_URL = "https://github.com/theohmwoa/agent-feedback-ui";

// ---------- useTheme — dark/light, persisted, applied to <html data-theme> ----------
function useTheme() {
  const [theme, setTheme] = React.useState(() => {
    try { return localStorage.getItem("agent-ui-theme") || "dark"; }
    catch { return "dark"; }
  });
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("agent-ui-theme", theme); } catch {}
  }, [theme]);
  return { theme, toggle: () => setTheme(t => t === "dark" ? "light" : "dark") };
}

// ---------- useHashRoute — read hash, scroll on changes, expose helper to push ----------
function useHashRoute() {
  const [hash, setHash] = React.useState(() =>
    typeof window === "undefined" ? "" : window.location.hash.replace(/^#/, "")
  );
  React.useEffect(() => {
    const onChange = () => setHash(window.location.hash.replace(/^#/, ""));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  // On every hash change (incl. initial mount), scroll to the element.
  React.useEffect(() => {
    if (!hash) return;
    // Wait one frame so the section has mounted.
    const t = setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: "smooth" });
    }, 30);
    return () => clearTimeout(t);
  }, [hash]);
  return {
    hash,
    push: (id) => {
      if (window.location.hash === "#" + id) {
        // same hash — force scroll
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: "smooth" });
      } else {
        history.pushState(null, "", "#" + id);
        setHash(id);
      }
    },
  };
}

// ---------- buildPaletteItems — pulls from REGISTRY, plus sections + actions ----------
function buildPaletteItems() {
  const items = [];
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

// ---------- CommandPalette ----------
function CommandPalette({ open, onClose, onPick, onTheme, onCopy }) {
  const [q, setQ] = React.useState("");
  const [sel, setSel] = React.useState(0);
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);

  const items = React.useMemo(buildPaletteItems, []);
  const filtered = React.useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return items;
    return items
      .map(it => {
        const hay = (it.name + " " + (it.slug || "") + " " + (it.desc || "") + " " + it.id).toLowerCase();
        const idx = hay.indexOf(qq);
        return idx === -1 ? null : { it, idx };
      })
      .filter(Boolean)
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

  const doAction = React.useCallback((item) => {
    if (!item) return;
    if (item.kind === "action") {
      if (item.id === "github") window.open(REPO_URL, "_blank", "noopener");
      else if (item.id === "theme-toggle") onTheme();
      else if (item.id === "copy-install") onCopy("npx agent-ui add email-compose slack-message linear-issue");
    } else if (item.kind === "component") {
      if (item.stable) onPick(item.id);
      else onPick("browser");
    } else if (item.kind === "section") {
      onPick(item.id);
    }
    onClose();
  }, [onPick, onTheme, onCopy, onClose]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape")    { e.preventDefault(); onClose(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); setSel(s => Math.min(filtered.length - 1, s + 1)); }
      else if (e.key === "ArrowUp")   { e.preventDefault(); setSel(s => Math.max(0, s - 1)); }
      else if (e.key === "Enter")     { e.preventDefault(); doAction(filtered[sel]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, sel, onClose, doAction]);

  // Keep selected row in view as user navigates
  React.useEffect(() => {
    if (!open || !listRef.current) return;
    const node = listRef.current.querySelector(`[data-idx="${sel}"]`);
    if (node && node.scrollIntoView) node.scrollIntoView({ block: "nearest" });
  }, [sel, open]);

  if (!open) return null;

  const groups = [
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
        {/* Search row */}
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

        {/* Results */}
        <div ref={listRef} style={{ maxHeight: "52vh", overflowY: "auto", padding: 6 }}>
          {filtered.length === 0 && (
            <div style={{
              padding: "28px 16px", textAlign: "center",
              fontSize: 13, color: "var(--fg-faint)",
            }}>
              No matches. Try <span style={{ fontFamily: "var(--font-mono)", color: "var(--fg-muted)" }}>email</span>,{" "}
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
                        color: "var(--fg)",
                        cursor: "pointer",
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
                        {item.kind === "component" && <Dot color={item.accent || "var(--fg-faint)"} size={6} />}
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

        {/* Hint footer */}
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

function Nav({ onOpenPalette, onNav, theme, onTheme }) {
  const navLinks = [
    { label: "Components", target: "browser" },
    { label: "CLI",        target: "cli" },
    { label: "Principles", target: "principles" },
  ];
  return (
    <nav style={{
      position: "sticky",
      top: 0, zIndex: 50,
      backdropFilter: "blur(12px) saturate(140%)",
      background: "color-mix(in oklch, var(--bg) 80%, transparent)",
      borderBottom: "1px solid var(--border-faint)",
    }}>
      <div className="wrap" style={{
        display: "flex", alignItems: "center", gap: 24,
        height: 56,
      }}>
        {/* Logo */}
        <a
          href="#top"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          style={{ display: "inline-flex", alignItems: "center", gap: 10 }}
          aria-label="agent-ui — back to top"
        >
          <span style={{
            width: 22, height: 22,
            borderRadius: 6,
            background: "var(--fg)",
            color: "var(--bg)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14,
          }}>a</span>
          <span style={{ fontWeight: 600, letterSpacing: -0.3 }}>agent-ui</span>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 10.5,
            color: "var(--fg-faint)",
            padding: "1px 6px",
            border: "1px solid var(--border)",
            borderRadius: 4,
            marginLeft: 2,
          }}>0.1.0</span>
        </a>

        <div style={{ display: "flex", gap: 22, marginLeft: 12 }}>
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={"#" + l.target}
              onClick={(e) => { e.preventDefault(); onNav(l.target); }}
              style={{
                fontSize: 13.5,
                color: "var(--fg-muted)",
                fontWeight: 400,
              }}
            >{l.label}</a>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* Search — opens command palette */}
        <button
          onClick={onOpenPalette}
          aria-label="Open command palette"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            height: 32, padding: "0 10px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 12.5,
            color: "var(--fg-faint)",
            minWidth: 240,
            cursor: "pointer",
            transition: "border-color .12s",
          }}
        >
          <Icon.Search size={13} />
          <span style={{ fontFamily: "var(--font-sans)" }}>Search components…</span>
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
            borderRadius: 8,
            color: "var(--fg-dim)",
            transition: "background .12s, color .12s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-inset)"; e.currentTarget.style.color = "var(--fg)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--fg-dim)"; }}
        >
          <Icon.GitHub size={16} />
        </a>
      </div>
    </nav>
  );
}

function Principles() {
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
          borderRadius: 12,
          overflow: "hidden",
        }}>
          {items.map(it => (
            <div key={it.kbd} style={{
              padding: "26px 28px",
              background: "var(--bg-card)",
              minHeight: 180,
            }}>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                color: "var(--fg-faint)",
                marginBottom: 10,
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

function CLISection() {
  const cmds = [
    { c: "npx agent-ui init", n: "set up agent-ui.json, paths, theme tokens" },
    { c: "npx agent-ui add email-compose slack-message", n: "fetch & write source into your repo" },
    { c: "npx agent-ui list", n: "show the registry" },
    { c: "npx agent-ui diff email-compose", n: "see what changed since you copied it" },
  ];
  return (
    <section id="cli" style={{ padding: "80px 0", borderBottom: "1px solid var(--border)" }}>
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 64, alignItems: "start" }}>
          <div>
            <SectionHeader
              eyebrow="cli/"
              title="One CLI. Four verbs. Done."
              subtitle="Modeled on shadcn — the source you copy is the source you ship. Diff against the registry whenever you want to see drift."
            />
            <div style={{ marginTop: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Pill tone="accent" size="md">init</Pill>
              <Pill tone="accent" size="md">add</Pill>
              <Pill tone="accent" size="md">list</Pill>
              <Pill tone="accent" size="md">diff</Pill>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cmds.map(c => (
              <div key={c.c} style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "12px 16px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: 10,
              }}>
                <Icon.ChevronRight size={14} style={{ color: "var(--fg-faint)", flexShrink: 0 }} />
                <code style={{
                  fontFamily: "var(--font-mono)", fontSize: 13.5,
                  color: "var(--fg)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  flexShrink: 0,
                }}>{c.c}</code>
                <span style={{ color: "var(--fg-faint)" }}>—</span>
                <span style={{ fontSize: 13, color: "var(--fg-muted)" }}>{c.n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ onNav }) {
  return (
    <footer style={{ padding: "60px 0 80px" }}>
      <div className="wrap">
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 480 }}>
            <div style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 38,
              letterSpacing: -0.6,
              lineHeight: 1.1,
            }}>
              The components are the project.
            </div>
            <p style={{
              marginTop: 14,
              fontSize: 13.5, color: "var(--fg-muted)", lineHeight: 1.55,
            }}>
              MIT-licensed. Built for anyone shipping agents into the world. No telemetry, no lock-in, no abstraction tax.
            </p>
          </div>
          <div style={{ display: "flex", gap: 48, fontSize: 13, color: "var(--fg-muted)" }}>
            <FooterCol title="Library" items={[
              { label: "Components",   onClick: () => onNav("browser") },
              { label: "CLI",          onClick: () => onNav("cli") },
              { label: "Principles",   onClick: () => onNav("principles") },
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
          marginTop: 56,
          paddingTop: 20,
          borderTop: "1px solid var(--border-faint)",
          display: "flex",
          justifyContent: "space-between",
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

function FooterCol({ title, items }) {
  return (
    <div>
      <div style={{
        fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6,
        color: "var(--fg-faint)", fontWeight: 500,
        marginBottom: 12,
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

function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { push: pushHash } = useHashRoute();
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(null); // { msg } | null

  // Smooth-scroll to a component when clicked from the grid OR palette.
  // Also updates the URL hash so the link is shareable.
  const navigate = React.useCallback((id) => {
    if (!id) return;
    pushHash(id);
  }, [pushHash]);

  // Global ⌘K / Ctrl+K hotkey to toggle the palette.
  React.useEffect(() => {
    const onKey = (e) => {
      const isMeta = e.metaKey || e.ctrlKey;
      if (isMeta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(o => !o);
      }
      // also "/" to focus search like GitHub, when not already typing
      if (e.key === "/" && !paletteOpen) {
        const t = e.target;
        const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
        if (!typing) { e.preventDefault(); setPaletteOpen(true); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen]);

  const handleCopy = React.useCallback((value) => {
    try { navigator.clipboard?.writeText(value); } catch {}
    setCopied({ msg: "Copied to clipboard", value });
  }, []);

  React.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 2400);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <div id="top">
      <Nav
        onOpenPalette={() => setPaletteOpen(true)}
        onNav={navigate}
        theme={theme}
        onTheme={toggleTheme}
      />
      <Hero
        onBrowse={() => navigate("browser")}
        onOpenPalette={() => setPaletteOpen(true)}
      />
      <Browser onPick={navigate} />
      <Showcase id="email-compose" onShare={(id) => handleCopy(window.location.origin + window.location.pathname + "#" + id)} />
      <Showcase id="slack-message" onShare={(id) => handleCopy(window.location.origin + window.location.pathname + "#" + id)} />
      <Showcase id="linear-issue"  onShare={(id) => handleCopy(window.location.origin + window.location.pathname + "#" + id)} />
      <CLISection />
      <Principles />
      <Footer onNav={navigate} />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onPick={navigate}
        onTheme={toggleTheme}
        onCopy={handleCopy}
      />

      {/* Tiny global "copied" toast for palette / share actions */}
      {copied && (
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
          <span>{copied.msg}</span>
          {copied.value && (
            <span style={{ color: "var(--fg-faint)", maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              · {copied.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);


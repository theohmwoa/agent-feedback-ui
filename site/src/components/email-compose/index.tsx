import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, IconButton, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { EMAIL_DEFAULT } from "./types";
import type { EmailIntent, EmailPayload } from "./types";

export type { EmailIntent, EmailPayload } from "./types";
export { EMAIL_DEFAULT } from "./types";

export function EmailCompose({
  intent = EMAIL_DEFAULT,
  onResult,
}: {
  intent?: EmailIntent;
  onResult?: (r: ReviewResult<EmailPayload>) => void;
}) {
  const [to, setTo] = React.useState<string[]>(intent.to);
  const [subject, setSubject] = React.useState(intent.subject);
  const [body, setBody] = React.useState(intent.body);
  const [edited, setEdited] = React.useState(false);
  const [showCc, setShowCc] = React.useState((intent.cc?.length ?? 0) > 0);
  const [cc, setCc] = React.useState<string[]>(intent.cc ?? []);
  const [removingPill, setRemovingPill] = React.useState<number | null>(null);

  const original = React.useRef({ to: intent.to, subject: intent.subject, body: intent.body });
  React.useEffect(() => {
    setEdited(
      JSON.stringify(to) !== JSON.stringify(original.current.to) ||
      subject !== original.current.subject ||
      body !== original.current.body
    );
  }, [to, subject, body]);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { to, cc, subject, body },
    summary: `Email → ${to[0]}${to.length > 1 ? ` +${to.length - 1}` : ""} · "${subject.slice(0, 32)}${subject.length > 32 ? "…" : ""}"`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Email send cancelled" });

  const removeRecipient = (i: number) => {
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
          borderBottom: "1px solid var(--border)", gap: 12,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-faint)" }}>
            review · then send
          </span>
          <button onClick={cancel} aria-label="Close" style={{
            width: 26, height: 26, borderRadius: 6,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: "var(--fg-dim)",
          }}>
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
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Send edited" : "Send"}
            <span style={{ marginLeft: 6, opacity: .55 }}>
              <Kbd>⌘</Kbd>
              <span style={{ marginLeft: 2 }}><Kbd>↵</Kbd></span>
            </span>
          </Button>
        </div>
      }
    >
      {intent.rationale && (
        <div style={{
          display: "flex", gap: 10, padding: "12px 16px",
          background: "color-mix(in oklch, var(--c-mail) 6%, transparent)",
          borderBottom: "1px solid var(--border-faint)",
          fontSize: 12.5, color: "var(--fg-muted)", lineHeight: 1.5,
        }}>
          <Icon.Sparkles size={14} style={{ color: "var(--c-mail)", marginTop: 2, flexShrink: 0 }} />
          <span>{intent.rationale}</span>
        </div>
      )}

      <div style={{ padding: "4px 16px" }}>
        <HeaderRow label="To" first>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, flex: 1, alignItems: "center" }}>
            {to.map((r, i) => (
              <RecipientPill
                key={r + i}
                value={r}
                onRemove={() => removeRecipient(i)}
                fading={removingPill === i}
              />
            ))}
            <input
              placeholder={to.length ? "" : "name@company.com"}
              onKeyDown={e => {
                if (e.key === "Enter" && (e.currentTarget as HTMLInputElement).value) {
                  setTo([...to, (e.currentTarget as HTMLInputElement).value]);
                  (e.currentTarget as HTMLInputElement).value = "";
                }
              }}
              style={{
                flex: 1, minWidth: 100,
                background: "transparent", border: 0, outline: 0,
                fontSize: 13.5, color: "var(--fg)", height: 28,
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
          color: "var(--fg)", lineHeight: 1.55,
          minHeight: 220, display: "block",
        }}
      />
    </ModalShell>
  );
}

function HeaderRow({ label, children, first }: {
  label: string; children: React.ReactNode; first?: boolean;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "6px 0",
      borderTop: first ? "none" : "1px solid var(--border-faint)",
    }}>
      <span style={{
        width: 52, fontSize: 11, fontWeight: 500,
        textTransform: "uppercase", letterSpacing: 0.6,
        color: "var(--fg-faint)",
      }}>{label}</span>
      {children}
    </div>
  );
}

function RecipientPill({ value, onRemove, fading }: {
  value: string; onRemove: () => void; fading?: boolean;
}) {
  const name = (value.split("@")[0] || "").replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      height: 24, padding: "0 4px 0 4px",
      background: "var(--bg-inset)",
      border: "1px solid var(--border)", borderRadius: 999,
      fontSize: 12, color: "var(--fg)",
      opacity: fading ? 0 : 1,
      transform: fading ? "scale(.92)" : "scale(1)",
      transition: "opacity .14s, transform .14s",
    }}>
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

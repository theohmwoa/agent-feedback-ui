import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { OOO_DEFAULT } from "./types";
import type { OooIntent, OooPayload, OooScope } from "./types";

export type { OooIntent, OooPayload, OooScope } from "./types";
export { OOO_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.13 60)";

const SCOPE_LABEL: Record<OooScope, { label: string; description: string }> = {
  everyone: { label: "Everyone",       description: "Auto-reply to anyone who emails you." },
  contacts: { label: "Only contacts",  description: "Auto-reply only to senders in your contacts." },
  external: { label: "External too",   description: "Includes senders outside your organization." },
};

// Render the body as a sequence of plain text + highlighted merge fields.
function renderBodyHighlighted(body: string) {
  const parts: Array<{ text: string; merge: boolean }> = [];
  const re = /\{([a-z_]+)\}/g;
  let last = 0;
  for (const m of body.matchAll(re)) {
    if (m.index! > last) parts.push({ text: body.slice(last, m.index), merge: false });
    parts.push({ text: m[0], merge: true });
    last = m.index! + m[0].length;
  }
  if (last < body.length) parts.push({ text: body.slice(last), merge: false });
  return parts;
}

export function OooMessage({
  intent = OOO_DEFAULT,
  onResult,
}: {
  intent?: OooIntent;
  onResult?: (r: ReviewResult<OooPayload>) => void;
}) {
  const [startsAt, setStartsAt] = React.useState(intent.startsAt);
  const [endsAt, setEndsAt] = React.useState(intent.endsAt);
  const [subject, setSubject] = React.useState(intent.subject);
  const [body, setBody] = React.useState(intent.body);
  const [scope, setScope] = React.useState<OooScope>(intent.scope ?? "everyone");
  const [urgentPager, setUrgentPager] = React.useState(intent.urgentPager ?? "");

  const edited =
    startsAt !== intent.startsAt ||
    endsAt !== intent.endsAt ||
    subject !== intent.subject ||
    body !== intent.body ||
    scope !== (intent.scope ?? "everyone") ||
    urgentPager !== (intent.urgentPager ?? "");

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      startsAt, endsAt, subject, body, scope,
      urgentPager: urgentPager || undefined,
    },
    summary: `OOO ${startsAt} → ${endsAt}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "OOO not set" });

  const parts = renderBodyHighlighted(body);

  return (
    <ModalShell
      width={620}
      accent={ACCENT}
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)", gap: 12,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <span style={{
            fontSize: 11, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)",
          }}>auto-reply</span>
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
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
            scope · {SCOPE_LABEL[scope].label.toLowerCase()}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Activate edited" : "Activate auto-reply"}
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
          display: "flex", gap: 10,
          padding: "12px 16px",
          background: `color-mix(in oklch, ${ACCENT} 6%, transparent)`,
          borderBottom: "1px solid var(--border-faint)",
          fontSize: 12.5, color: "var(--fg-muted)", lineHeight: 1.5,
        }}>
          <Icon.Sparkles size={14} style={{ color: ACCENT, marginTop: 2, flexShrink: 0 }} />
          <span>{intent.rationale}</span>
        </div>
      )}

      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Date range */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
        }}>
          <DateField label="Starts" value={startsAt} onChange={setStartsAt} />
          <DateField label="Ends"   value={endsAt}   onChange={setEndsAt} />
        </div>

        {/* Subject */}
        <div>
          <Label>Subject</Label>
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            style={{
              width: "100%", height: 34, padding: "0 12px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)", borderRadius: 8,
              outline: 0, fontSize: 14, fontWeight: 500,
              color: "var(--fg)",
            }}
          />
        </div>

        {/* Body — preview + textarea */}
        <div>
          <Label>Body — merge fields like <code style={{
            fontFamily: "var(--font-mono)",
            color: ACCENT,
          }}>&#123;first_name&#125;</code></Label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={9}
            style={{
              width: "100%", padding: "12px 14px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)", borderRadius: 10,
              outline: 0, fontSize: 13, lineHeight: 1.6,
              color: "var(--fg)",
            }}
          />
          {/* Highlighted preview */}
          <div style={{
            marginTop: 8,
            padding: "10px 12px",
            background: "color-mix(in oklch, var(--bg-inset) 50%, transparent)",
            border: "1px dashed var(--border-faint)",
            borderRadius: 8,
            fontSize: 12, lineHeight: 1.55,
            color: "var(--fg-muted)",
            whiteSpace: "pre-wrap",
            fontFamily: "var(--font-mono)",
          }}>
            <div style={{
              fontSize: 10, color: "var(--fg-faint)",
              textTransform: "uppercase", letterSpacing: 0.6,
              marginBottom: 6,
            }}>preview · merge fields highlighted</div>
            {parts.map((p, i) =>
              p.merge ? (
                <span key={i} style={{
                  background: `color-mix(in oklch, ${ACCENT} 18%, transparent)`,
                  color: ACCENT,
                  padding: "1px 4px", borderRadius: 4,
                }}>{p.text}</span>
              ) : (
                <span key={i}>{p.text}</span>
              )
            )}
          </div>
        </div>

        {/* Scope */}
        <div>
          <Label>Reply scope</Label>
          <div style={{ display: "flex", gap: 6 }}>
            {(["everyone", "contacts", "external"] as OooScope[]).map(s => (
              <button
                key={s}
                onClick={() => setScope(s)}
                style={{
                  flex: 1, textAlign: "left",
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: scope === s
                    ? `color-mix(in oklch, ${ACCENT} 14%, transparent)`
                    : "var(--bg-inset)",
                  color: "var(--fg)",
                  border: `1px solid ${scope === s ? `color-mix(in oklch, ${ACCENT} 40%, transparent)` : "var(--border)"}`,
                }}
              >
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>
                  {SCOPE_LABEL[s].label}
                </div>
                <div style={{ fontSize: 11, color: "var(--fg-faint)", marginTop: 2 }}>
                  {SCOPE_LABEL[s].description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Urgent pager */}
        <div>
          <Label>Urgent pager (optional)</Label>
          <input
            value={urgentPager}
            onChange={e => setUrgentPager(e.target.value)}
            placeholder="urgent@example.com"
            style={{
              width: "100%", height: 34, padding: "0 12px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)", borderRadius: 8,
              outline: 0, fontSize: 13,
              fontFamily: "var(--font-mono)",
              color: "var(--fg)",
            }}
          />
        </div>
      </div>
    </ModalShell>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11, fontFamily: "var(--font-mono)",
      color: "var(--fg-faint)",
      textTransform: "uppercase", letterSpacing: 0.6,
      marginBottom: 6,
    }}>{children}</div>
  );
}

function DateField({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", height: 34, padding: "0 12px",
          background: "var(--bg-inset)",
          border: "1px solid var(--border)", borderRadius: 8,
          outline: 0, fontSize: 13, color: "var(--fg)",
        }}
      />
    </div>
  );
}

import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { MAILCHIMP_DEFAULT } from "./types";
import type { MailchimpIntent, MailchimpPayload } from "./types";

export type { MailchimpIntent, MailchimpPayload } from "./types";
export { MAILCHIMP_DEFAULT } from "./types";

const ACCENT = "oklch(0.74 0.16 65)";

export function MailchimpBroadcast({
  intent = MAILCHIMP_DEFAULT,
  onResult,
}: {
  intent?: MailchimpIntent;
  onResult?: (r: ReviewResult<MailchimpPayload>) => void;
}) {
  const [subject, setSubject] = React.useState(intent.subject);
  const [previewText, setPreviewText] = React.useState(intent.previewText);
  const [fromName, setFromName] = React.useState(intent.fromName);
  const [scheduleAt, setScheduleAt] = React.useState(intent.scheduleAt ?? "");

  const edited =
    subject !== intent.subject ||
    previewText !== intent.previewText ||
    fromName !== intent.fromName ||
    scheduleAt !== (intent.scheduleAt ?? "");

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      list: intent.list,
      segment: intent.segment,
      subject, previewText, fromName,
      fromEmail: intent.fromEmail,
      scheduleAt: scheduleAt || undefined,
    },
    summary: `${intent.list} · ~${(intent.audienceCount / 1000).toFixed(1)}k recipients`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Campaign cancelled" });

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
          <div style={{ flex: 1 }} />
          <Pill tone="warn" size="sm">production · large reach</Pill>
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
            {scheduleAt ? `scheduled · ${scheduleAt}` : "send now"}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {scheduleAt ? "Schedule" : edited ? "Send edited" : "Send campaign"}
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

      {/* Audience reach hero */}
      <div style={{
        padding: "20px 18px",
        borderBottom: "1px solid var(--border-faint)",
        background: `color-mix(in oklch, ${ACCENT} 4%, transparent)`,
        display: "flex", alignItems: "center", gap: 18,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 11, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)",
            textTransform: "uppercase", letterSpacing: 0.6,
            marginBottom: 6,
          }}>Estimated reach</div>
          <div style={{
            fontSize: 38, fontWeight: 600, letterSpacing: -1.4,
            color: "var(--fg)",
            display: "flex", alignItems: "baseline", gap: 6,
            fontFamily: "var(--font-sans)",
          }}>
            {intent.audienceCount.toLocaleString()}
            <span style={{ fontSize: 13, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>recipients</span>
          </div>
        </div>
        <div style={{
          padding: "10px 14px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          fontSize: 12, fontFamily: "var(--font-mono)",
        }}>
          <div style={{ color: "var(--fg-faint)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>
            list / segment
          </div>
          <div style={{ color: "var(--fg)", fontWeight: 500 }}>{intent.list}</div>
          {intent.segment && (
            <div style={{ color: ACCENT, fontSize: 11, marginTop: 2 }}>
              · {intent.segment}
            </div>
          )}
        </div>
      </div>

      {/* Edit fields */}
      <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
        <Field label="Subject">
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            style={inputStyle}
          />
        </Field>
        <Field label="Preview text" hint="The little blurb shown next to the subject in inbox previews.">
          <input
            value={previewText}
            onChange={e => setPreviewText(e.target.value)}
            style={inputStyle}
          />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="From name">
            <input
              value={fromName}
              onChange={e => setFromName(e.target.value)}
              style={inputStyle}
            />
          </Field>
          <Field label="From address">
            <input
              value={intent.fromEmail}
              readOnly
              style={{ ...inputStyle, color: "var(--fg-faint)", fontFamily: "var(--font-mono)", fontSize: 12 }}
            />
          </Field>
        </div>
        <Field label="When">
          <select
            value={scheduleAt}
            onChange={e => setScheduleAt(e.target.value)}
            style={inputStyle}
          >
            <option value="">send now</option>
            <option value="+1h">in 1 hour</option>
            <option value="tomorrow-9">tomorrow at 9am</option>
            <option value="tuesday-10">next Tuesday at 10am</option>
            <option value="best-time">Mailchimp best-time send</option>
          </select>
        </Field>
      </div>
    </ModalShell>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 32,
  padding: "0 10px",
  background: "var(--bg-inset)",
  border: "1px solid var(--border)",
  borderRadius: 6,
  outline: 0,
  fontSize: 13, color: "var(--fg)",
  fontFamily: "var(--font-sans)",
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{
        fontSize: 10.5, fontFamily: "var(--font-mono)",
        color: "var(--fg-faint)", letterSpacing: 0.6,
        textTransform: "uppercase", marginBottom: 6,
      }}>{label}</div>
      {children}
      {hint && (
        <div style={{ marginTop: 4, fontSize: 11, color: "var(--fg-faint)" }}>{hint}</div>
      )}
    </div>
  );
}

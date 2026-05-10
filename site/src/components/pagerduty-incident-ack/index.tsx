import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { PD_DEFAULT } from "./types";
import type { PdIntent, PdPayload, PdPostAction } from "./types";

export type { PdIntent, PdPayload, PdPostAction } from "./types";
export { PD_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.18 145)";

const ETA_OPTIONS = [5, 15, 30, 60];
const SNOOZE_OPTIONS = [0, 5, 10, 30];

export function PagerdutyIncidentAck({
  intent = PD_DEFAULT,
  onResult,
}: {
  intent?: PdIntent;
  onResult?: (r: ReviewResult<PdPayload>) => void;
}) {
  const [etaMins, setEtaMins] = React.useState<number>(intent.defaultEtaMins ?? 15);
  const [snoozeMins, setSnoozeMins] = React.useState<number>(0);
  const [postAction, setPostAction] = React.useState<PdPostAction>(intent.defaultPostAction ?? "none");

  const edited =
    etaMins !== (intent.defaultEtaMins ?? 15) ||
    snoozeMins !== 0 ||
    postAction !== (intent.defaultPostAction ?? "none");

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { incidentNumber: intent.incidentNumber, etaMins, snoozeMins, postAction },
    summary: `Ack ${intent.incidentNumber} · eta ${etaMins}m`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: `Ack of ${intent.incidentNumber} cancelled` });

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
            fontFamily: "var(--font-mono)", fontSize: 12,
            color: ACCENT,
            padding: "2px 8px",
            border: `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)`,
            background: `color-mix(in oklch, ${ACCENT} 10%, transparent)`,
            borderRadius: 6,
          }}>{intent.incidentNumber}</span>
          <div style={{ flex: 1 }} />
          <Pill
            tone={intent.urgency === "high" ? "err" : "warn"}
            size="sm"
          >
            {intent.urgency === "high" ? "high urgency" : "low urgency"}
          </Pill>
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
            triggered · <span style={{ color: "var(--fg-muted)" }}>{intent.triggeredAt}</span>
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Check size={13} />} onClick={submit}>
            {edited ? "Acknowledge edited" : "Acknowledge"}
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

      {/* Incident card */}
      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{
          fontSize: 16, fontWeight: 600, lineHeight: 1.35,
          color: "var(--fg)",
        }}>{intent.title}</div>

        <div style={{
          display: "flex", flexWrap: "wrap", gap: 8,
          fontSize: 12, fontFamily: "var(--font-mono)",
        }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "3px 8px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 6,
            color: "var(--fg)",
          }}>
            <Icon.Layers size={12} style={{ color: ACCENT }} />
            {intent.service}
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "3px 8px",
            background: "color-mix(in oklch, var(--c-err) 10%, transparent)",
            border: "1px solid color-mix(in oklch, var(--c-err) 30%, transparent)",
            borderRadius: 6,
            color: "var(--c-err)",
          }}>
            <Icon.AlertTriangle size={11} />
            {intent.alertsCount} alert{intent.alertsCount === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {/* Oncall */}
      <div style={{
        padding: "12px 18px",
        borderTop: "1px solid var(--border-faint)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Avatar name={intent.oncallName} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500 }}>{intent.oncallName}</div>
          <div style={{ fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>
            primary oncall · {intent.oncallEscalation ?? "no escalation"}
          </div>
        </div>
        <Pill size="xs" tone="ok">you're up</Pill>
      </div>

      {/* ETA picker */}
      <Section
        label="ETA to resolve"
        hint="how long do you think this'll take?"
      >
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {ETA_OPTIONS.map(m => (
            <Choice
              key={m}
              active={etaMins === m}
              onClick={() => setEtaMins(m)}
              accent={ACCENT}
            >
              {m}m
            </Choice>
          ))}
          <input
            type="number"
            value={etaMins}
            onChange={e => setEtaMins(Math.max(1, Number(e.target.value) || 1))}
            style={{
              width: 70, height: 28, padding: "0 8px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)", borderRadius: 6,
              fontSize: 12, fontFamily: "var(--font-mono)",
              color: "var(--fg)", outline: 0,
            }}
          />
        </div>
      </Section>

      {/* Snooze */}
      <Section label="Snooze re-page">
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {SNOOZE_OPTIONS.map(m => (
            <Choice
              key={m}
              active={snoozeMins === m}
              onClick={() => setSnoozeMins(m)}
              accent={ACCENT}
            >
              {m === 0 ? "off" : `${m}m`}
            </Choice>
          ))}
        </div>
      </Section>

      {/* Post-incident action */}
      <Section label="After ack">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <PostAction
            active={postAction === "none"}
            onClick={() => setPostAction("none")}
            icon={<Icon.Minus size={13} />}
            label="Just acknowledge"
            sub="agent stops here; you take it from your terminal"
            accent={ACCENT}
          />
          <PostAction
            active={postAction === "open-slack"}
            onClick={() => setPostAction("open-slack")}
            icon={<Icon.Hash size={13} />}
            label={`Open ${intent.slackChannel ?? "incident channel"}`}
            sub="agent posts an opening summary"
            accent={ACCENT}
          />
          <PostAction
            active={postAction === "run-runbook"}
            onClick={() => setPostAction("run-runbook")}
            icon={<Icon.Terminal size={13} />}
            label={intent.runbookName ? `Run ${intent.runbookName}` : "Run runbook"}
            sub="agent executes the standard mitigation"
            accent={ACCENT}
          />
        </div>
      </Section>
    </ModalShell>
  );
}

function Section({
  label, hint, children,
}: {
  label: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div style={{
      padding: "12px 18px",
      borderTop: "1px solid var(--border-faint)",
    }}>
      <div style={{
        display: "flex", alignItems: "baseline", gap: 8,
        fontSize: 10.5, fontFamily: "var(--font-mono)",
        textTransform: "uppercase", letterSpacing: 0.6,
        color: "var(--fg-faint)", marginBottom: 8,
      }}>
        <span>{label}</span>
        {hint && <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--fg-faint)" }}>· {hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Choice({
  active, onClick, accent, children,
}: {
  active: boolean; onClick: () => void; accent: string; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 28, padding: "0 12px",
        fontSize: 12, fontFamily: "var(--font-mono)",
        background: active
          ? `color-mix(in oklch, ${accent} 16%, transparent)`
          : "var(--bg-inset)",
        border: `1px solid ${active ? accent : "var(--border)"}`,
        color: active ? accent : "var(--fg-muted)",
        borderRadius: 6,
        transition: "all .12s",
      }}
    >
      {children}
    </button>
  );
}

function PostAction({
  active, onClick, icon, label, sub, accent,
}: {
  active: boolean; onClick: () => void;
  icon: React.ReactNode; label: string; sub: string; accent: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 12px",
        textAlign: "left",
        background: active
          ? `color-mix(in oklch, ${accent} 8%, transparent)`
          : "var(--bg-inset)",
        border: `1px solid ${active ? `color-mix(in oklch, ${accent} 40%, transparent)` : "var(--border-faint)"}`,
        borderRadius: 8,
        transition: "all .12s",
      }}
    >
      <span style={{
        width: 28, height: 28, borderRadius: 6,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        background: active ? accent : "var(--bg-card)",
        color: active ? "var(--bg)" : "var(--fg-muted)",
        flexShrink: 0,
      }}>
        {icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)" }}>{label}</div>
        <div style={{ fontSize: 11.5, color: "var(--fg-faint)" }}>{sub}</div>
      </div>
      {active && <Icon.Check size={14} style={{ color: accent }} />}
    </button>
  );
}

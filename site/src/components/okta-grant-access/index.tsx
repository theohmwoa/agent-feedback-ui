import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { OKTA_DEFAULT } from "./types";
import type { OktaIntent, OktaPayload } from "./types";

export type { OktaIntent, OktaPayload } from "./types";
export { OKTA_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.13 240)";
const EXPIRES_OPTIONS = ["in 1 day", "in 7 days", "in 30 days", "no expiry"];

export function OktaGrantAccess({
  intent = OKTA_DEFAULT,
  onResult,
}: {
  intent?: OktaIntent;
  onResult?: (r: ReviewResult<OktaPayload>) => void;
}) {
  const [expiresAt, setExpiresAt] = React.useState(intent.defaultExpires ?? "in 7 days");
  const [justification, setJustification] = React.useState(intent.defaultJustification ?? "");

  const justificationOk = justification.trim().length >= 10;
  const edited =
    expiresAt !== (intent.defaultExpires ?? "in 7 days") ||
    justification !== (intent.defaultJustification ?? "");

  const submit = () => {
    if (!justificationOk) return;
    onResult?.({
      kind: edited ? "edit" : "submit",
      payload: {
        userEmail: intent.user.email,
        application: intent.application,
        groupOrRole: intent.groupOrRole,
        expiresAt: expiresAt === "no expiry" ? undefined : expiresAt,
        justification,
      },
      summary: `Grant ${intent.groupOrRole} → ${intent.user.email}`,
    });
  };
  const cancel = () => onResult?.({ kind: "cancel", summary: "Access grant cancelled" });

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
            display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--fg-faint)",
          }}>
            <Icon.Lock size={11} /> okta
          </span>
          <div style={{ flex: 1 }} />
          {intent.expandsAccess && (
            <Pill tone="warn" size="sm" icon={<Icon.AlertTriangle size={11} />}>
              expands access
            </Pill>
          )}
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
          {intent.requestId && (
            <a
              href={intent.requestUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: 11, fontFamily: "var(--font-mono)",
                color: "var(--fg-muted)",
                textDecoration: "none",
              }}
            >
              <Icon.ExternalLink size={11} />
              {intent.requestId}
            </a>
          )}
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant={intent.expandsAccess ? "danger" : "primary"}
            size="sm"
            disabled={!justificationOk}
            icon={<Icon.Check size={13} />}
            onClick={submit}
          >
            {edited ? "Grant edited" : "Grant access"}
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

      {/* User card */}
      <div style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar name={intent.user.name} size={42} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{intent.user.name}</div>
          <div style={{
            fontSize: 12, color: "var(--fg-muted)", fontFamily: "var(--font-mono)",
          }}>{intent.user.email}</div>
          {intent.user.department && (
            <div style={{ fontSize: 11.5, color: "var(--fg-faint)", marginTop: 2 }}>
              {intent.user.department}
            </div>
          )}
        </div>
      </div>

      {/* Current groups */}
      <div style={{ padding: "0 18px 14px" }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          textTransform: "uppercase", letterSpacing: 0.6,
          color: "var(--fg-faint)", marginBottom: 8,
        }}>Current groups</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {intent.user.currentGroups.map(g => (
            <span key={g} style={{
              fontFamily: "var(--font-mono)", fontSize: 11.5,
              padding: "2px 8px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              color: "var(--fg-muted)",
            }}>{g}</span>
          ))}
        </div>
      </div>

      {/* Grant detail */}
      <div style={{
        padding: "14px 18px",
        borderTop: "1px solid var(--border-faint)",
        display: "grid", gridTemplateColumns: "auto 1fr",
        gap: "8px 16px",
        alignItems: "center",
      }}>
        <span style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          textTransform: "uppercase", letterSpacing: 0.6,
          color: "var(--fg-faint)",
        }}>Application</span>
        <span style={{ fontSize: 13.5, fontWeight: 500 }}>{intent.application}</span>

        <span style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          textTransform: "uppercase", letterSpacing: 0.6,
          color: "var(--fg-faint)",
        }}>{intent.groupKind === "role" ? "Role" : "Group"}</span>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 12.5, fontFamily: "var(--font-mono)",
          padding: "3px 8px",
          background: `color-mix(in oklch, ${ACCENT} 12%, transparent)`,
          border: `1px solid color-mix(in oklch, ${ACCENT} 32%, transparent)`,
          borderRadius: 6,
          color: ACCENT,
          alignSelf: "flex-start",
          width: "fit-content",
        }}>
          <Icon.Plus size={11} />
          {intent.groupOrRole}
        </span>
      </div>

      {/* Expiration */}
      <div style={{
        padding: "12px 18px",
        borderTop: "1px solid var(--border-faint)",
      }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          textTransform: "uppercase", letterSpacing: 0.6,
          color: "var(--fg-faint)", marginBottom: 8,
        }}>Expires</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {EXPIRES_OPTIONS.map(o => {
            const active = expiresAt === o;
            return (
              <button
                key={o}
                onClick={() => setExpiresAt(o)}
                style={{
                  height: 28, padding: "0 12px",
                  fontSize: 12, fontFamily: "var(--font-mono)",
                  background: active ? `color-mix(in oklch, ${ACCENT} 16%, transparent)` : "var(--bg-inset)",
                  border: `1px solid ${active ? ACCENT : "var(--border)"}`,
                  color: active ? ACCENT : "var(--fg-muted)",
                  borderRadius: 6,
                }}
              >
                {o}
              </button>
            );
          })}
        </div>
      </div>

      {/* Justification (required) */}
      <div style={{
        padding: "12px 18px",
        borderTop: "1px solid var(--border-faint)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          textTransform: "uppercase", letterSpacing: 0.6,
          color: "var(--fg-faint)", marginBottom: 8,
        }}>
          <span>Justification</span>
          <span style={{ color: "var(--c-err)" }}>* required</span>
        </div>
        <textarea
          value={justification}
          onChange={e => setJustification(e.target.value)}
          rows={3}
          placeholder="Why does this person need this access? (audit-logged)"
          style={{
            width: "100%", padding: "10px 12px",
            background: "var(--bg-inset)",
            border: `1px solid ${justificationOk ? "var(--border)" : "color-mix(in oklch, var(--c-err) 30%, transparent)"}`,
            borderRadius: 8,
            fontSize: 13, lineHeight: 1.55, color: "var(--fg)",
            outline: 0,
          }}
        />
        {!justificationOk && (
          <div style={{ fontSize: 11, color: "var(--c-err)", marginTop: 6 }}>
            min 10 characters
          </div>
        )}
      </div>
    </ModalShell>
  );
}

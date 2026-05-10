import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { SENTRY_DEFAULT } from "./types";
import type { SentryAssignee, SentryIntent, SentryPayload, SentryResolveType } from "./types";

export type { SentryIntent, SentryPayload, SentryResolveType, SentryAssignee } from "./types";
export { SENTRY_DEFAULT } from "./types";

const ACCENT = "oklch(0.62 0.16 290)";

const RESOLVE_TYPES: Array<{ id: SentryResolveType; label: string; sub: string }> = [
  { id: "now",           label: "Resolve immediately", sub: "marked done; reopens only if it fires again" },
  { id: "next-release",  label: "In next release",     sub: "auto-reopens if seen in the new version" },
  { id: "in-commit",     label: "In specific commit",  sub: "auto-reopens if seen after that sha" },
  { id: "in-version",    label: "In specific version", sub: "auto-reopens if seen after that release tag" },
];

export function SentryResolve({
  intent = SENTRY_DEFAULT,
  onResult,
}: {
  intent?: SentryIntent;
  onResult?: (r: ReviewResult<SentryPayload>) => void;
}) {
  const [resolveType, setResolveType] = React.useState<SentryResolveType>(intent.defaultResolveType ?? "now");
  const [version, setVersion] = React.useState(intent.defaultVersion ?? "");
  const [assignee, setAssignee] = React.useState<string>(intent.defaultAssignee?.email ?? "");
  const [reminderIfRecurs, setReminderIfRecurs] = React.useState(true);

  const edited =
    resolveType !== (intent.defaultResolveType ?? "now") ||
    version !== (intent.defaultVersion ?? "") ||
    assignee !== (intent.defaultAssignee?.email ?? "") ||
    reminderIfRecurs !== true;

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      issueId: intent.issueId,
      resolveType,
      version: (resolveType === "in-commit" || resolveType === "in-version") ? version : undefined,
      assignee: assignee || undefined,
      reminderIfRecurs,
    },
    summary: `Resolve ${intent.shortId}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: `${intent.shortId} resolve cancelled` });

  const showVersion = resolveType === "in-commit" || resolveType === "in-version";

  return (
    <ModalShell
      width={600}
      accent={ACCENT}
      header={
        <div style={{
          display: "flex", alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)", gap: 12,
        }}>
          <AgentBadge agent={intent.agent} action={intent.action} />
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11.5,
            color: ACCENT,
            padding: "2px 8px",
            border: `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)`,
            background: `color-mix(in oklch, ${ACCENT} 10%, transparent)`,
            borderRadius: 6,
          }}>{intent.shortId}</span>
          <div style={{ flex: 1 }} />
          {intent.environment && (
            <Pill tone={intent.environment === "production" ? "warn" : "default"} size="sm">
              {intent.environment}
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
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)" }}>
            project · {intent.project}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Check size={13} />} onClick={submit}>
            {edited ? "Resolve edited" : "Resolve"}
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

      {/* Big-occurrences card */}
      <div style={{ padding: "16px 18px", display: "flex", gap: 18, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: "var(--c-err)", marginBottom: 4,
            textTransform: "uppercase", letterSpacing: 0.6,
          }}>{intent.errorType}</div>
          <div style={{
            fontSize: 14, fontWeight: 500, lineHeight: 1.4,
            color: "var(--fg)",
            wordBreak: "break-word",
          }}>{intent.title}</div>
          <div style={{
            marginTop: 8,
            fontSize: 11.5, fontFamily: "var(--font-mono)", color: "var(--fg-faint)",
          }}>
            last seen · {intent.lastSeen}
          </div>
        </div>
        <div style={{
          flexShrink: 0, textAlign: "right",
          minWidth: 100,
        }}>
          <div style={{
            fontFamily: "var(--font-mono)", fontWeight: 700,
            fontSize: 36, lineHeight: 1, letterSpacing: -1.2,
            color: "var(--fg)",
          }}>{intent.occurrences.toLocaleString()}</div>
          <div style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            color: "var(--fg-faint)", marginTop: 4,
            textTransform: "uppercase", letterSpacing: 0.6,
          }}>occurrences</div>
          {intent.usersAffected !== undefined && (
            <div style={{ fontSize: 11, color: "var(--fg-muted)", marginTop: 6 }}>
              {intent.usersAffected.toLocaleString()} users
            </div>
          )}
        </div>
      </div>

      {/* Resolve type */}
      <div style={{
        padding: "12px 18px",
        borderTop: "1px solid var(--border-faint)",
      }}>
        <div style={{
          fontSize: 10.5, fontFamily: "var(--font-mono)",
          textTransform: "uppercase", letterSpacing: 0.6,
          color: "var(--fg-faint)", marginBottom: 8,
        }}>Resolve as</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {RESOLVE_TYPES.map(rt => {
            const active = resolveType === rt.id;
            return (
              <button
                key={rt.id}
                onClick={() => setResolveType(rt.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", textAlign: "left",
                  background: active ? `color-mix(in oklch, ${ACCENT} 8%, transparent)` : "var(--bg-inset)",
                  border: `1px solid ${active ? `color-mix(in oklch, ${ACCENT} 40%, transparent)` : "var(--border-faint)"}`,
                  borderRadius: 8,
                }}
              >
                <span style={{
                  width: 14, height: 14, borderRadius: 999,
                  border: `2px solid ${active ? ACCENT : "var(--fg-faint)"}`,
                  background: active ? ACCENT : "transparent",
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)" }}>{rt.label}</div>
                  <div style={{ fontSize: 11.5, color: "var(--fg-faint)" }}>{rt.sub}</div>
                </div>
              </button>
            );
          })}
        </div>

        {showVersion && (
          <input
            value={version}
            onChange={e => setVersion(e.target.value)}
            placeholder={resolveType === "in-commit" ? "commit sha" : "version tag (e.g. v3.4.2)"}
            style={{
              marginTop: 8, width: "100%",
              height: 32, padding: "0 12px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12.5, fontFamily: "var(--font-mono)",
              color: "var(--fg)", outline: 0,
            }}
          />
        )}
      </div>

      {/* Assignee */}
      {(intent.assignees?.length ?? 0) > 0 && (
        <div style={{
          padding: "12px 18px",
          borderTop: "1px solid var(--border-faint)",
        }}>
          <div style={{
            fontSize: 10.5, fontFamily: "var(--font-mono)",
            textTransform: "uppercase", letterSpacing: 0.6,
            color: "var(--fg-faint)", marginBottom: 8,
          }}>Assign to</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            <button
              onClick={() => setAssignee("")}
              style={pickerStyle(assignee === "", ACCENT)}
            >
              <span style={{
                width: 18, height: 18, borderRadius: 999,
                border: "1px dashed var(--border-strong)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                color: "var(--fg-faint)",
              }}><Icon.X size={9} /></span>
              unassigned
            </button>
            {intent.assignees!.map(a => (
              <button
                key={a.email}
                onClick={() => setAssignee(a.email)}
                style={pickerStyle(assignee === a.email, ACCENT)}
              >
                <Avatar name={a.name} size={18} />
                {a.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reminder */}
      <div style={{
        padding: "12px 18px",
        borderTop: "1px solid var(--border-faint)",
      }}>
        <label style={{
          display: "flex", alignItems: "center", gap: 10,
          fontSize: 13, color: "var(--fg-muted)", cursor: "pointer",
        }}>
          <input
            type="checkbox"
            checked={reminderIfRecurs}
            onChange={e => setReminderIfRecurs(e.target.checked)}
            style={{ accentColor: ACCENT }}
          />
          <span>Remind me if this recurs</span>
        </label>
      </div>
    </ModalShell>
  );
}

function pickerStyle(active: boolean, accent: string): React.CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", gap: 6,
    height: 30, padding: "0 10px 0 4px",
    fontSize: 12,
    background: active ? `color-mix(in oklch, ${accent} 14%, transparent)` : "var(--bg-inset)",
    border: `1px solid ${active ? `color-mix(in oklch, ${accent} 40%, transparent)` : "var(--border)"}`,
    color: active ? accent : "var(--fg-muted)",
    borderRadius: 999,
  };
}

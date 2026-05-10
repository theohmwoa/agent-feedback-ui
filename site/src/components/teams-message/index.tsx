import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Button, IconButton, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { TEAMS_DEFAULT, IMPORTANCE_COLOR } from "./types";
import type { TeamsImportance, TeamsIntent, TeamsPayload } from "./types";

export type { TeamsIntent, TeamsPayload, TeamsImportance } from "./types";
export { TEAMS_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.13 270)";

export function TeamsMessage({
  intent = TEAMS_DEFAULT,
  onResult,
}: {
  intent?: TeamsIntent;
  onResult?: (r: ReviewResult<TeamsPayload>) => void;
}) {
  const [message, setMessage] = React.useState(intent.message);
  const [importance, setImportance] = React.useState<TeamsImportance>(intent.importance);
  const [mentions, setMentions] = React.useState<string[]>(intent.mentions ?? []);

  const edited =
    message !== intent.message ||
    importance !== intent.importance ||
    JSON.stringify(mentions) !== JSON.stringify(intent.mentions ?? []);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: { team: intent.team, channel: intent.channel, message, importance, mentions },
    summary: `${intent.team} / ${intent.channel} · ${importance.toLowerCase()}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Teams post cancelled" });

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
            posting to {intent.team} / #{intent.channel}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button
            variant={importance === "Urgent" ? "danger" : "primary"}
            size="sm"
            icon={<Icon.Send size={13} />}
            onClick={submit}
          >
            {edited ? `Send edited` : `Send`}
          </Button>
        </div>
      }
    >
      {/* Breadcrumb */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 16px",
        background: `color-mix(in oklch, ${ACCENT} 6%, transparent)`,
        borderBottom: "1px solid var(--border-faint)",
        fontSize: 12,
        fontFamily: "var(--font-mono)",
      }}>
        <Icon.Users size={13} style={{ color: ACCENT }} />
        <span style={{ color: "var(--fg)" }}>{intent.team}</span>
        <Icon.ChevronRight size={11} style={{ color: "var(--fg-faint)" }} />
        <Icon.Hash size={11} style={{ color: "var(--fg-faint)" }} />
        <span style={{ color: "var(--fg)", fontWeight: 500 }}>{intent.channel}</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: "var(--fg-faint)", fontSize: 11 }}>Microsoft Teams</span>
      </div>

      {intent.rationale && (
        <div style={{
          display: "flex", gap: 10,
          padding: "10px 16px",
          fontSize: 12, color: "var(--fg-muted)",
          background: `color-mix(in oklch, ${ACCENT} 4%, transparent)`,
          borderBottom: "1px solid var(--border-faint)",
        }}>
          <Icon.Sparkles size={13} style={{ color: ACCENT, marginTop: 2, flexShrink: 0 }} />
          <span>{intent.rationale}</span>
        </div>
      )}

      {/* Importance */}
      <div style={{ padding: "12px 16px 8px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)", textTransform: "uppercase", letterSpacing: 0.6 }}>
          Importance
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {(["Normal", "Important", "Urgent"] as TeamsImportance[]).map(level => {
            const t = IMPORTANCE_COLOR[level];
            const active = importance === level;
            return (
              <button
                key={level}
                onClick={() => setImportance(level)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  height: 24, padding: "0 10px",
                  fontSize: 12, fontWeight: 500,
                  border: `1px solid ${active ? t.bd : "var(--border)"}`,
                  background: active ? t.bg : "transparent",
                  color: active ? t.fg : "var(--fg-muted)",
                  borderRadius: 6,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: 999, background: t.fg }} />
                {level}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body editor */}
      <div style={{ padding: "0 16px" }}>
        <div style={{
          border: "1px solid var(--border)",
          borderRadius: 10,
          background: "var(--bg-inset)",
          overflow: "hidden",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 2,
            padding: "6px 8px",
            borderBottom: "1px solid var(--border-faint)",
            color: "var(--fg-dim)",
          }}>
            <IconButton icon={<Icon.Bold size={13} />} label="bold" />
            <IconButton icon={<Icon.Italic size={13} />} label="italic" />
            <IconButton icon={<Icon.Code size={13} />} label="code" />
            <IconButton icon={<Icon.AtSign size={13} />} label="mention" />
            <IconButton icon={<Icon.Link size={13} />} label="link" />
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-faint)", marginRight: 6 }}>
              markdown
            </span>
          </div>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={7}
            style={{
              width: "100%", padding: "12px 14px",
              background: "transparent", border: 0, outline: 0,
              fontSize: 13.5, fontFamily: "var(--font-sans)",
              color: "var(--fg)", lineHeight: 1.55,
              minHeight: 140, display: "block",
            }}
          />
        </div>

        {mentions.length > 0 && (
          <div style={{ margin: "10px 0 14px", display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>mentions →</span>
            {mentions.map(m => (
              <span
                key={m}
                onClick={() => setMentions(mentions.filter(x => x !== m))}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: 11, padding: "2px 8px",
                  background: `color-mix(in oklch, ${ACCENT} 14%, var(--bg-inset))`,
                  border: `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)`,
                  borderRadius: 999,
                  color: ACCENT, cursor: "pointer",
                }}
              >
                {m}
                <Icon.X size={9} />
              </span>
            ))}
          </div>
        )}

        <div style={{ height: 8 }} />
      </div>
    </ModalShell>
  );
}

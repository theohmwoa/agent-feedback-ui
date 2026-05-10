import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { GOOGLE_MEET_DEFAULT } from "./types";
import type { GoogleMeetIntent, GoogleMeetPayload, MeetAttendee } from "./types";

export type { GoogleMeetIntent, GoogleMeetPayload, MeetAttendee } from "./types";
export { GOOGLE_MEET_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.18 60)";

export function GoogleMeetCreate({
  intent = GOOGLE_MEET_DEFAULT,
  onResult,
}: {
  intent?: GoogleMeetIntent;
  onResult?: (r: ReviewResult<GoogleMeetPayload>) => void;
}) {
  const [title, setTitle] = React.useState(intent.title);
  const [startsAt, setStartsAt] = React.useState(intent.startsAt);
  const [endsAt, setEndsAt] = React.useState(intent.endsAt);
  const [attendees, setAttendees] = React.useState<MeetAttendee[]>(intent.attendees);
  const [hostCanMute, setHostCanMute] = React.useState(intent.hostCanMute ?? true);
  const [requireApproval, setRequireApproval] = React.useState(intent.requireApproval ?? false);
  const [recordAuto, setRecordAuto] = React.useState(intent.recordAuto ?? false);
  const [breakoutRooms, setBreakoutRooms] = React.useState(intent.breakoutRooms ?? 0);

  const edited =
    title !== intent.title ||
    startsAt !== intent.startsAt ||
    endsAt !== intent.endsAt ||
    JSON.stringify(attendees) !== JSON.stringify(intent.attendees) ||
    hostCanMute !== (intent.hostCanMute ?? true) ||
    requireApproval !== (intent.requireApproval ?? false) ||
    recordAuto !== (intent.recordAuto ?? false) ||
    breakoutRooms !== (intent.breakoutRooms ?? 0);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      title, startsAt, endsAt,
      attendees: attendees.map(a => a.email),
      hostCanMute, requireApproval, recordAuto, breakoutRooms,
    },
    summary: `${title} · ${startsAt}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Meet creation cancelled" });

  const conflicts = attendees.filter(a => a.conflict).length;

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
          }}>Google Meet</span>
          <div style={{ flex: 1 }} />
          {conflicts > 0 && (
            <Pill tone="warn" size="sm" icon={<Icon.AlertTriangle size={11} />}>
              {conflicts} conflict{conflicts === 1 ? "" : "s"}
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
            {intent.timezone ?? "local"}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Create edited Meet" : "Create & invite"}
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
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Meeting title"
          style={{
            width: "100%", padding: "8px 0",
            background: "transparent",
            border: 0, borderBottom: "1px solid var(--border-faint)",
            outline: 0, fontSize: 19, fontWeight: 600, color: "var(--fg)",
          }}
        />

        <Row icon={<Icon.Calendar size={14} />}>
          <input
            value={startsAt}
            onChange={e => setStartsAt(e.target.value)}
            style={{
              flex: 1, height: 32, padding: "0 10px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)", borderRadius: 8,
              outline: 0, fontSize: 13, color: "var(--fg)",
            }}
          />
          <span style={{ color: "var(--fg-faint)" }}>→</span>
          <input
            value={endsAt}
            onChange={e => setEndsAt(e.target.value)}
            style={{
              flex: 1, height: 32, padding: "0 10px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)", borderRadius: 8,
              outline: 0, fontSize: 13, color: "var(--fg)",
            }}
          />
        </Row>

        <Row icon={<Icon.Users size={14} />}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            {attendees.map(a => (
              <div key={a.email} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "6px 10px",
                background: "var(--bg-inset)",
                border: "1px solid " + (a.conflict ? "color-mix(in oklch, var(--c-warn) 40%, transparent)" : "var(--border)"),
                borderRadius: 8, fontSize: 13,
              }}>
                <Avatar name={a.name || a.email} size={20} />
                <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                  <span style={{ fontWeight: 500 }}>{a.name || a.email}</span>
                  {a.name && (
                    <span style={{ fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>
                      {a.email}
                    </span>
                  )}
                </div>
                {a.conflict && (
                  <Pill tone="warn" size="xs" icon={<Icon.AlertTriangle size={9} />}>busy</Pill>
                )}
                <button
                  onClick={() => setAttendees(attendees.filter(x => x.email !== a.email))}
                  style={{ color: "var(--fg-faint)", padding: 4 }}
                  aria-label={`remove ${a.email}`}
                >
                  <Icon.X size={11} />
                </button>
              </div>
            ))}
            <AddAttendee
              onAdd={(value) => {
                if (attendees.some(a => a.email === value)) return;
                const guessName = value.split("@")[0]!.replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
                setAttendees([...attendees, { email: value, name: guessName || undefined }]);
              }}
            />
          </div>
        </Row>

        {/* Toggles */}
        <div style={{
          marginTop: 6, padding: "12px 14px",
          background: "var(--bg-inset)",
          border: "1px solid var(--border-faint)",
          borderRadius: 10,
          display: "flex", flexDirection: "column", gap: 10,
        }}>
          <Toggle
            label="Host can mute participants"
            description="Restrict mute control to the host."
            checked={hostCanMute}
            onChange={setHostCanMute}
          />
          <Toggle
            label="Require approval to join"
            description="Knock-to-enter for anyone outside the invite list."
            checked={requireApproval}
            onChange={setRequireApproval}
          />
          <Toggle
            label="Auto-record meeting"
            description="Saved to host's Drive."
            checked={recordAuto}
            onChange={setRecordAuto}
          />
        </div>

        <Row icon={<Icon.Layers size={14} />}>
          <span style={{ fontSize: 12.5, color: "var(--fg-muted)" }}>Breakout rooms</span>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <button
              onClick={() => setBreakoutRooms(Math.max(0, breakoutRooms - 1))}
              style={{
                width: 24, height: 24, borderRadius: 6,
                background: "var(--bg-inset)",
                border: "1px solid var(--border)",
                color: "var(--fg-muted)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}
              aria-label="decrease breakout rooms"
            >
              <Icon.Minus size={12} />
            </button>
            <span style={{
              minWidth: 28, textAlign: "center",
              fontFamily: "var(--font-mono)", fontSize: 13,
              color: "var(--fg)",
            }}>{breakoutRooms}</span>
            <button
              onClick={() => setBreakoutRooms(Math.min(20, breakoutRooms + 1))}
              style={{
                width: 24, height: 24, borderRadius: 6,
                background: "var(--bg-inset)",
                border: "1px solid var(--border)",
                color: "var(--fg-muted)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}
              aria-label="increase breakout rooms"
            >
              <Icon.Plus size={12} />
            </button>
          </div>
        </Row>
      </div>
    </ModalShell>
  );
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <span style={{ width: 22, color: "var(--fg-faint)", display: "inline-flex", justifyContent: "center", marginTop: 6 }}>
        {icon}
      </span>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>{children}</div>
    </div>
  );
}

function Toggle({ label, description, checked, onChange }: {
  label: string; description?: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label style={{
      display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
    }}>
      <button
        onClick={() => onChange(!checked)}
        type="button"
        aria-pressed={checked}
        style={{
          width: 32, height: 18, borderRadius: 999,
          background: checked ? "var(--agent-ui-accent)" : "var(--border)",
          border: 0, padding: 0, position: "relative",
          transition: "background .15s",
          flexShrink: 0,
        }}
      >
        <span style={{
          position: "absolute",
          top: 2, left: checked ? 16 : 2,
          width: 14, height: 14, borderRadius: 999,
          background: "var(--bg-card)",
          transition: "left .15s",
        }} />
      </button>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: "var(--fg)" }}>{label}</div>
        {description && (
          <div style={{ fontSize: 11.5, color: "var(--fg-faint)", marginTop: 1 }}>{description}</div>
        )}
      </div>
    </label>
  );
}

function AddAttendee({ onAdd }: { onAdd: (value: string) => void }) {
  const [value, setValue] = React.useState("");
  const [focus, setFocus] = React.useState(false);
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const submit = () => {
    if (!isEmail) return;
    onAdd(value.trim());
    setValue("");
  };
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "4px 8px",
      background: "transparent",
      border: `1px dashed ${focus ? "color-mix(in oklch, var(--agent-ui-accent) 60%, var(--border-strong))" : "var(--border-strong)"}`,
      borderRadius: 8, fontSize: 13,
      transition: "border-color .12s",
    }}>
      <Icon.Plus size={12} style={{ color: "var(--fg-faint)" }} />
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); submit(); } }}
        placeholder="add attendee — name@example.com"
        style={{
          flex: 1, height: 28, padding: 0,
          background: "transparent", border: 0, outline: 0,
          fontSize: 13, color: "var(--fg)",
        }}
      />
      <button
        onClick={submit}
        disabled={!isEmail}
        style={{
          fontSize: 11, fontFamily: "var(--font-mono)",
          padding: "2px 8px",
          background: isEmail ? "color-mix(in oklch, var(--agent-ui-accent) 18%, transparent)" : "transparent",
          color: isEmail ? "var(--agent-ui-accent)" : "var(--fg-faint)",
          border: `1px solid ${isEmail ? "color-mix(in oklch, var(--agent-ui-accent) 40%, transparent)" : "var(--border)"}`,
          borderRadius: 6,
          cursor: isEmail ? "pointer" : "not-allowed",
        }}
      >add</button>
    </div>
  );
}

import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, Kbd, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { ZOOM_DEFAULT } from "./types";
import type {
  ZoomAttendee, ZoomMeetingIntent, ZoomMeetingPayload, ZoomRecording,
} from "./types";

export type {
  ZoomMeetingIntent, ZoomMeetingPayload, ZoomRecording, ZoomAttendee,
} from "./types";
export { ZOOM_DEFAULT } from "./types";

const ACCENT = "oklch(0.66 0.13 240)";

const RECORD_LABELS: Record<ZoomRecording, string> = {
  none:  "None",
  cloud: "Cloud",
  local: "Local",
};

export function ZoomMeetingCreate({
  intent = ZOOM_DEFAULT,
  onResult,
}: {
  intent?: ZoomMeetingIntent;
  onResult?: (r: ReviewResult<ZoomMeetingPayload>) => void;
}) {
  const [topic, setTopic] = React.useState(intent.topic);
  const [startsAt, setStartsAt] = React.useState(intent.startsAt);
  const [duration, setDuration] = React.useState(intent.durationMinutes);
  const [hostEmail, setHostEmail] = React.useState(intent.hostEmail);
  const [password, setPassword] = React.useState(intent.password ?? "");
  const [showPassword, setShowPassword] = React.useState(false);
  const [waitingRoom, setWaitingRoom] = React.useState(intent.waitingRoom ?? true);
  const [registration, setRegistration] = React.useState(intent.registrationRequired ?? false);
  const [recording, setRecording] = React.useState<ZoomRecording>(intent.recording ?? "none");
  const [attendees, setAttendees] = React.useState<ZoomAttendee[]>(intent.attendees ?? []);

  const edited =
    topic !== intent.topic ||
    startsAt !== intent.startsAt ||
    duration !== intent.durationMinutes ||
    hostEmail !== intent.hostEmail ||
    password !== (intent.password ?? "") ||
    waitingRoom !== (intent.waitingRoom ?? true) ||
    registration !== (intent.registrationRequired ?? false) ||
    recording !== (intent.recording ?? "none") ||
    JSON.stringify(attendees) !== JSON.stringify(intent.attendees ?? []);

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      topic, startsAt, durationMinutes: duration,
      hostEmail,
      password: password || undefined,
      waitingRoom, registrationRequired: registration, recording,
      attendees: attendees.map(a => a.email),
    },
    summary: `${topic} · ${startsAt} · ${duration}min`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Zoom meeting cancelled" });

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
          }}>Zoom · scheduled</span>
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
            host · {hostEmail}
          </span>
          <div style={{ flex: 1 }} />
          {edited && <Pill tone="accent" size="sm">edited</Pill>}
          <Button variant="ghost" size="sm" onClick={cancel}>Cancel</Button>
          <Button variant="primary" size="sm" icon={<Icon.Send size={13} />} onClick={submit}>
            {edited ? "Schedule edited" : "Schedule meeting"}
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
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="Meeting topic"
          style={{
            width: "100%", padding: "8px 0",
            background: "transparent",
            border: 0, borderBottom: "1px solid var(--border-faint)",
            outline: 0, fontSize: 19, fontWeight: 600, color: "var(--fg)",
          }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 130px", gap: 8 }}>
          <Row icon={<Icon.Calendar size={14} />}>
            <input
              value={startsAt}
              onChange={e => setStartsAt(e.target.value)}
              placeholder="Start time"
              style={{
                flex: 1, height: 32, padding: "0 10px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border)", borderRadius: 8,
                outline: 0, fontSize: 13, color: "var(--fg)",
              }}
            />
          </Row>
          <Row icon={<Icon.Layers size={14} />}>
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              flex: 1, height: 32, padding: "0 6px 0 10px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)", borderRadius: 8,
            }}>
              <input
                type="number"
                min={5} max={480}
                value={duration}
                onChange={e => setDuration(parseInt(e.target.value || "0", 10))}
                style={{
                  flex: 1, width: 0, padding: 0,
                  background: "transparent",
                  border: 0, outline: 0, fontSize: 13,
                  color: "var(--fg)", textAlign: "right",
                }}
              />
              <span style={{ fontSize: 11, color: "var(--fg-faint)", fontFamily: "var(--font-mono)" }}>min</span>
            </div>
          </Row>
        </div>

        <Row icon={<Icon.User size={14} />}>
          <input
            value={hostEmail}
            onChange={e => setHostEmail(e.target.value)}
            placeholder="Host email"
            style={{
              flex: 1, height: 32, padding: "0 10px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)", borderRadius: 8,
              outline: 0, fontSize: 13, color: "var(--fg)",
              fontFamily: "var(--font-mono)",
            }}
          />
        </Row>

        <Row icon={<Icon.Lock size={14} />}>
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            flex: 1, height: 32, padding: "0 6px 0 10px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 8,
          }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={intent.passcodeOptional ? "Passcode (optional)" : "Passcode"}
              style={{
                flex: 1, padding: 0,
                background: "transparent", border: 0, outline: 0,
                fontSize: 13, color: "var(--fg)",
                fontFamily: "var(--font-mono)",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              style={{
                fontSize: 11, padding: "2px 6px",
                background: "transparent", border: 0,
                color: "var(--fg-faint)", fontFamily: "var(--font-mono)",
              }}
              aria-label={showPassword ? "hide password" : "show password"}
            >
              {showPassword ? "hide" : "show"}
            </button>
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
            label="Waiting room"
            description="Host admits each participant individually."
            checked={waitingRoom}
            onChange={setWaitingRoom}
          />
          <Toggle
            label="Registration required"
            description="Participants must register before they can join."
            checked={registration}
            onChange={setRegistration}
          />
        </div>

        {/* Recording */}
        <Row icon={<Icon.Image size={14} />}>
          <span style={{ fontSize: 12.5, color: "var(--fg-muted)" }}>Recording</span>
          <div style={{ display: "flex", gap: 4 }}>
            {(["none", "cloud", "local"] as ZoomRecording[]).map(r => (
              <button
                key={r}
                onClick={() => setRecording(r)}
                style={{
                  fontSize: 12, padding: "4px 10px",
                  borderRadius: 6,
                  background: recording === r
                    ? `color-mix(in oklch, ${ACCENT} 16%, transparent)`
                    : "var(--bg-inset)",
                  color: recording === r ? ACCENT : "var(--fg-muted)",
                  border: `1px solid ${recording === r ? `color-mix(in oklch, ${ACCENT} 40%, transparent)` : "var(--border)"}`,
                  fontWeight: recording === r ? 600 : 400,
                }}
              >{RECORD_LABELS[r]}</button>
            ))}
          </div>
        </Row>

        {/* Attendees */}
        <Row icon={<Icon.Users size={14} />}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            {attendees.map(a => (
              <div key={a.email} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "6px 10px",
                background: "var(--bg-inset)",
                border: "1px solid var(--border)", borderRadius: 8,
                fontSize: 13,
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
    <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
      <button
        onClick={() => onChange(!checked)}
        type="button"
        aria-pressed={checked}
        style={{
          width: 32, height: 18, borderRadius: 999,
          background: checked ? "var(--agent-ui-accent)" : "var(--border)",
          border: 0, padding: 0, position: "relative",
          transition: "background .15s", flexShrink: 0,
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

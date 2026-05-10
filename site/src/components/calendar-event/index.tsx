import React from "react";
import { Icon } from "../../chrome/icons";
import {
  AgentBadge, Avatar, Button, ModalShell, Pill,
} from "../../chrome/primitives";
import type { ReviewResult } from "../../types";
import { CALENDAR_DEFAULT } from "./types";
import type { CalendarAttendee, CalendarIntent, CalendarPayload } from "./types";

export type { CalendarAttendee, CalendarIntent, CalendarPayload } from "./types";
export { CALENDAR_DEFAULT } from "./types";

const ACCENT = "oklch(0.74 0.12 60)";

export function CalendarEvent({
  intent = CALENDAR_DEFAULT,
  onResult,
}: {
  intent?: CalendarIntent;
  onResult?: (r: ReviewResult<CalendarPayload>) => void;
}) {
  const [title, setTitle] = React.useState(intent.title);
  const [startsAt, setStartsAt] = React.useState(intent.startsAt);
  const [endsAt, setEndsAt] = React.useState(intent.endsAt);
  const [attendees, setAttendees] = React.useState<CalendarAttendee[]>(intent.attendees);
  const [location, setLocation] = React.useState(intent.location ?? "");
  const [conferenceLink, setConferenceLink] = React.useState(intent.conferenceLink ?? "");
  const [description, setDescription] = React.useState(intent.description ?? "");

  const edited =
    title !== intent.title ||
    startsAt !== intent.startsAt ||
    endsAt !== intent.endsAt ||
    JSON.stringify(attendees) !== JSON.stringify(intent.attendees) ||
    location !== (intent.location ?? "") ||
    conferenceLink !== (intent.conferenceLink ?? "") ||
    description !== (intent.description ?? "");

  const submit = () => onResult?.({
    kind: edited ? "edit" : "submit",
    payload: {
      title, startsAt, endsAt,
      attendees: attendees.map(a => a.email),
      location: location || undefined,
      conferenceLink: conferenceLink || undefined,
      description: description || undefined,
    },
    summary: `${title} · ${startsAt}`,
  });
  const cancel = () => onResult?.({ kind: "cancel", summary: "Meeting cancelled" });

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
            {edited ? "Send edited invite" : "Send invite"}
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
          placeholder="Event title"
          style={{
            width: "100%", padding: "8px 0",
            background: "transparent",
            border: 0, borderBottom: "1px solid var(--border-faint)",
            outline: 0,
            fontSize: 19, fontWeight: 600,
            color: "var(--fg)",
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
                borderRadius: 8,
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
                {a.conflict && (
                  <Pill tone="warn" size="xs" icon={<Icon.AlertTriangle size={9} />}>
                    busy
                  </Pill>
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
          </div>
        </Row>

        <Row icon={<Icon.Hash size={14} />}>
          <input
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Location"
            style={{
              flex: 1, height: 32, padding: "0 10px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)", borderRadius: 8,
              outline: 0, fontSize: 13, color: "var(--fg)",
            }}
          />
        </Row>

        <Row icon={<Icon.Link size={14} />}>
          <input
            value={conferenceLink}
            onChange={e => setConferenceLink(e.target.value)}
            placeholder="Conference link"
            style={{
              flex: 1, height: 32, padding: "0 10px",
              background: "var(--bg-inset)",
              border: "1px solid var(--border)", borderRadius: 8,
              outline: 0, fontSize: 13,
              fontFamily: "var(--font-mono)",
              color: "var(--fg-muted)",
            }}
          />
        </Row>

        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
          rows={4}
          style={{
            width: "100%", padding: "10px 12px",
            background: "var(--bg-inset)",
            border: "1px solid var(--border)", borderRadius: 10,
            outline: 0,
            fontSize: 13, lineHeight: 1.55,
            color: "var(--fg)",
          }}
        />
      </div>
    </ModalShell>
  );
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ width: 22, color: "var(--fg-faint)", display: "inline-flex", justifyContent: "center" }}>
        {icon}
      </span>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
        {children}
      </div>
    </div>
  );
}

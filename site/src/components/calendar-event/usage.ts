export const usage = `import { CalendarEvent } from "@/components/agent-ui/calendar-event";

<CalendarEvent
  intent={{
    title: "Q3 partnership review",
    startsAt: "2026-05-14T14:00",
    endsAt:   "2026-05-14T14:30",
    timezone: "America/Los_Angeles",
    attendees: [
      { email: "maya@nordlight.studio", name: "Maya Okafor" },
      { email: "kai@nordlight.studio",  name: "Kai", conflict: true },
    ],
    location: "Zoom",
    conferenceLink: zoomLink,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      gcal.events.insert({ calendarId: "primary", resource: r.payload });
    }
  }}
/>`;

export const props = [
  { name: "intent",    type: "CalendarIntent",                            req: true,  desc: "Title, time range, attendees (with conflict flags), location, link, description." },
  { name: "onResult",  type: "(r: ReviewResult<CalendarPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "attendees", type: "CalendarAttendee[]",                        req: true,  desc: "Set { conflict: true } for any attendee that's busy at the proposed time." },
];

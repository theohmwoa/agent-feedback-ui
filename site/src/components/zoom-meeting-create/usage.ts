export const usage = `import { ZoomMeetingCreate } from "@/components/agent-ui/zoom-meeting-create";

<ZoomMeetingCreate
  intent={{
    topic: "Acme Corp kickoff",
    startsAt: "2026-05-19T09:00",
    durationMinutes: 45,
    hostEmail: "theo@nordlight.studio",
    password: "Welcome2026",
    waitingRoom: true,
    registrationRequired: true,
    recording: "cloud",
    attendees: [
      { email: "jess.acme@acme.example", name: "Jess Vargas" },
    ],
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      zoom.meetings.create({ ...r.payload });
    }
  }}
/>`;

export const props = [
  { name: "intent",       type: "ZoomMeetingIntent",                            req: true,  desc: "Topic, time, duration, host, passcode, waiting room, registration, recording, attendees." },
  { name: "onResult",     type: "(r: ReviewResult<ZoomMeetingPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "recording",    type: "'none' | 'cloud' | 'local'",                   req: false, desc: "Where the recording lands. Defaults to 'none'." },
];

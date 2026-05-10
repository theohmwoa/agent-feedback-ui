export const usage = `import { GoogleMeetCreate } from "@/components/agent-ui/google-meet-create";

<GoogleMeetCreate
  intent={{
    title: "Design review — onboarding redesign v3",
    startsAt: "2026-05-21T10:00",
    endsAt:   "2026-05-21T11:00",
    attendees: [
      { email: "lena@nordlight.studio", name: "Lena Huang" },
      { email: "isaac@nordlight.studio", name: "Isaac Park", conflict: true },
    ],
    hostCanMute: true,
    requireApproval: false,
    recordAuto: true,
    breakoutRooms: 0,
  }}
  onResult={(r) => {
    if (r.kind === "submit" || r.kind === "edit") {
      gmeet.spaces.create({ ...r.payload });
    }
  }}
/>`;

export const props = [
  { name: "intent",    type: "GoogleMeetIntent",                            req: true,  desc: "Title, time range, attendees with conflict flags, host controls, recording, breakout rooms." },
  { name: "onResult",  type: "(r: ReviewResult<GoogleMeetPayload>) => void", req: true, desc: "Fired with kind: 'submit' | 'edit' | 'cancel'." },
  { name: "attendees", type: "MeetAttendee[]",                              req: true,  desc: "Set { conflict: true } to flag attendees who are busy at the proposed time." },
];

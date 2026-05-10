import type { AgentMeta } from "../../types";

export type ZoomRecording = "none" | "cloud" | "local";

export type ZoomAttendee = {
  email: string;
  name?: string;
};

export type ZoomMeetingIntent = AgentMeta & {
  topic: string;
  startsAt: string;
  durationMinutes: number;
  hostEmail: string;
  password?: string;
  passcodeOptional?: boolean;
  waitingRoom?: boolean;
  registrationRequired?: boolean;
  recording?: ZoomRecording;
  attendees?: ZoomAttendee[];
};

export type ZoomMeetingPayload = {
  topic: string;
  startsAt: string;
  durationMinutes: number;
  hostEmail: string;
  password?: string;
  waitingRoom: boolean;
  registrationRequired: boolean;
  recording: ZoomRecording;
  attendees: string[];
};

export const ZOOM_DEFAULT: ZoomMeetingIntent = {
  agent: "atlas",
  action: "create-zoom",
  topic: "Customer onboarding — Acme Corp kickoff",
  startsAt: "Mon, May 19 · 9:00 AM",
  durationMinutes: 45,
  hostEmail: "theo@nordlight.studio",
  password: "Welcome2026",
  passcodeOptional: false,
  waitingRoom: true,
  registrationRequired: true,
  recording: "cloud",
  attendees: [
    { email: "jess.acme@acme.example", name: "Jess Vargas (Acme)" },
    { email: "rob.acme@acme.example",  name: "Rob Patel (Acme)" },
    { email: "lena@nordlight.studio",  name: "Lena Huang" },
  ],
  rationale: "Drafted from the Acme deal-stage transition; matched the kickoff template you used for the last three customers.",
};

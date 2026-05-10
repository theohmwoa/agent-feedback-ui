import type { AgentMeta } from "../../types";

export type MeetAttendee = {
  email: string;
  name?: string;
  conflict?: boolean;
};

export type GoogleMeetIntent = AgentMeta & {
  title: string;
  startsAt: string;
  endsAt: string;
  timezone?: string;
  attendees: MeetAttendee[];
  hostCanMute?: boolean;
  requireApproval?: boolean;
  recordAuto?: boolean;
  breakoutRooms?: number;
};

export type GoogleMeetPayload = {
  title: string;
  startsAt: string;
  endsAt: string;
  attendees: string[];
  hostCanMute: boolean;
  requireApproval: boolean;
  recordAuto: boolean;
  breakoutRooms: number;
};

export const GOOGLE_MEET_DEFAULT: GoogleMeetIntent = {
  agent: "atlas",
  action: "create-meet",
  title: "Design review — onboarding redesign v3",
  startsAt: "Wed, May 21 · 10:00 AM",
  endsAt:   "Wed, May 21 · 11:00 AM",
  timezone: "America/Los_Angeles",
  attendees: [
    { email: "lena.huang@nordlight.studio", name: "Lena Huang" },
    { email: "theo@nordlight.studio",       name: "Theophilus Homawoo" },
    { email: "isaac.research@nordlight.studio", name: "Isaac Park", conflict: true },
    { email: "priya.eng@nordlight.studio",  name: "Priya Raman" },
  ],
  hostCanMute: true,
  requireApproval: false,
  recordAuto: true,
  breakoutRooms: 0,
  rationale: "Pulled the design crit cadence from your weekly schedule. Isaac has a hard conflict — flagged.",
};

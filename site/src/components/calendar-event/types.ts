import type { AgentMeta } from "../../types";

export type CalendarAttendee = {
  email: string;
  name?: string;
  conflict?: boolean;
};

export type CalendarIntent = AgentMeta & {
  title: string;
  startsAt: string;
  endsAt: string;
  timezone?: string;
  attendees: CalendarAttendee[];
  location?: string;
  conferenceLink?: string;
  description?: string;
};

export type CalendarPayload = {
  title: string;
  startsAt: string;
  endsAt: string;
  attendees: string[];
  location?: string;
  conferenceLink?: string;
  description?: string;
};

export const CALENDAR_DEFAULT: CalendarIntent = {
  agent: "atlas",
  action: "schedule-meeting",
  title: "Q3 partnership terms — final review",
  startsAt: "Thu, May 14 · 2:00 PM",
  endsAt:   "Thu, May 14 · 2:30 PM",
  timezone: "America/Los_Angeles",
  attendees: [
    { email: "maya.okafor@nordlight.studio", name: "Maya Okafor" },
    { email: "theo@nordlight.studio",        name: "Theophilus Homawoo" },
    { email: "kai.legal@nordlight.studio",   name: "Kai (Legal)", conflict: true },
  ],
  location: "Zoom",
  conferenceLink: "https://nordlight.zoom.us/j/8482919147",
  description: "Walk through the final redlines together before this goes to legal. Royalty split (60/40 vs 55/45) and termination notice (90d → 60d?) are the two open items.",
  rationale: "Pulled the open items from your email thread with Maya. Kai (Legal) has a conflict — flagged for you.",
};

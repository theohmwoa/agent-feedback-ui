import type { AgentMeta } from "../../types";

export type MailchimpIntent = AgentMeta & {
  list: string;
  segment?: string;
  audienceCount: number;
  subject: string;
  previewText: string;
  fromName: string;
  fromEmail: string;
  scheduleAt?: string;
};

export type MailchimpPayload = {
  list: string;
  segment?: string;
  subject: string;
  previewText: string;
  fromName: string;
  fromEmail: string;
  scheduleAt?: string;
};

export const MAILCHIMP_DEFAULT: MailchimpIntent = {
  agent: "atlas",
  action: "send-campaign",
  list: "Customers · monthly",
  segment: "Engaged in last 30 days",
  audienceCount: 14_287,
  subject: "Northwind monthly — May edition (faster /verify, new docs hub)",
  previewText: "p99 down 85% on the auth gateway, plus a refreshed docs site",
  fromName: "Atlas at Northwind",
  fromEmail: "atlas@northwind.dev",
  rationale: "Pulled the headline items from your changelog drafts + the new docs site launch issue. Audience pre-filtered to engaged customers from the last 30d.",
};

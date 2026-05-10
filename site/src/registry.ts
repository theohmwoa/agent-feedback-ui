// The catalog. Adding a new component:
//   1. Drop a folder into src/components/<slug>/ with index.tsx, types.ts,
//      meta.ts, usage.ts.
//   2. Import its meta + component below.
//   3. Add an entry to STABLE.
// Everything else (landing grid, command palette, /c/<slug> pages, install
// commands, prop tables, code samples) reads from this file.

import React from "react";

import { meta as emailMeta }    from "./components/email-compose/meta";
import { meta as slackMeta }    from "./components/slack-message/meta";
import { meta as linearMeta }   from "./components/linear-issue/meta";
import { meta as shellMeta }    from "./components/shell-command/meta";
import { meta as smsMeta }      from "./components/sms-message/meta";
import { meta as ghIssueMeta }  from "./components/github-issue/meta";
import { meta as httpMeta }     from "./components/http-request/meta";
import { meta as notionMeta }   from "./components/notion-page/meta";
import { meta as calendarMeta } from "./components/calendar-event/meta";
import { meta as stripeMeta }   from "./components/stripe-payment/meta";
import { meta as sqlMeta }      from "./components/sql-query-runner/meta";
import { meta as patchMeta }    from "./components/file-patch-preview/meta";
import { meta as prMeta }       from "./components/github-pr-review/meta";

import { usage as emailUsage,    props as emailProps    } from "./components/email-compose/usage";
import { usage as slackUsage,    props as slackProps    } from "./components/slack-message/usage";
import { usage as linearUsage,   props as linearProps   } from "./components/linear-issue/usage";
import { usage as shellUsage,    props as shellProps    } from "./components/shell-command/usage";
import { usage as smsUsage,      props as smsProps      } from "./components/sms-message/usage";
import { usage as ghIssueUsage,  props as ghIssueProps  } from "./components/github-issue/usage";
import { usage as httpUsage,     props as httpProps     } from "./components/http-request/usage";
import { usage as notionUsage,   props as notionProps   } from "./components/notion-page/usage";
import { usage as calendarUsage, props as calendarProps } from "./components/calendar-event/usage";
import { usage as stripeUsage,   props as stripeProps   } from "./components/stripe-payment/usage";
import { usage as sqlUsage,      props as sqlProps      } from "./components/sql-query-runner/usage";
import { usage as patchUsage,    props as patchProps    } from "./components/file-patch-preview/usage";
import { usage as prUsage,       props as prProps       } from "./components/github-pr-review/usage";

import { EmailCompose }     from "./components/email-compose";
import { SlackMessage }     from "./components/slack-message";
import { LinearIssue }      from "./components/linear-issue";
import { ShellCommand }     from "./components/shell-command";
import { SmsMessage }       from "./components/sms-message";
import { GithubIssue }      from "./components/github-issue";
import { HttpRequest }      from "./components/http-request";
import { NotionPage }       from "./components/notion-page";
import { CalendarEvent }    from "./components/calendar-event";
import { StripePayment }    from "./components/stripe-payment";
import { SqlQueryRunner }   from "./components/sql-query-runner";
import { FilePatchPreview } from "./components/file-patch-preview";
import { GithubPrReview }   from "./components/github-pr-review";

export type ComponentStatus = "stable" | "soon";

export type ComponentMeta = {
  id: string;
  name: string;
  title: string;
  accent: string;
  summary: string;
  deps?: string[];
  loc?: number;
  status: ComponentStatus;
  category?: string;
};

export type PropRow = {
  name: string;
  type: string;
  req: boolean;
  desc: string;
};

export type RegistryEntry = ComponentMeta & {
  Component?: React.ComponentType<{ onResult?: (r: unknown) => void }>;
  usage?: string;
  props?: PropRow[];
};

type R = RegistryEntry["Component"];

export const STABLE: RegistryEntry[] = [
  { ...emailMeta,    Component: EmailCompose     as R, usage: emailUsage,    props: emailProps },
  { ...slackMeta,    Component: SlackMessage     as R, usage: slackUsage,    props: slackProps },
  { ...linearMeta,   Component: LinearIssue      as R, usage: linearUsage,   props: linearProps },
  { ...prMeta,       Component: GithubPrReview   as R, usage: prUsage,       props: prProps },
  { ...patchMeta,    Component: FilePatchPreview as R, usage: patchUsage,    props: patchProps },
  { ...shellMeta,    Component: ShellCommand     as R, usage: shellUsage,    props: shellProps },
  { ...sqlMeta,      Component: SqlQueryRunner   as R, usage: sqlUsage,      props: sqlProps },
  { ...calendarMeta, Component: CalendarEvent    as R, usage: calendarUsage, props: calendarProps },
  { ...ghIssueMeta,  Component: GithubIssue      as R, usage: ghIssueUsage,  props: ghIssueProps },
  { ...notionMeta,   Component: NotionPage       as R, usage: notionUsage,   props: notionProps },
  { ...httpMeta,     Component: HttpRequest      as R, usage: httpUsage,     props: httpProps },
  { ...stripeMeta,   Component: StripePayment    as R, usage: stripeUsage,   props: stripeProps },
  { ...smsMeta,      Component: SmsMessage       as R, usage: smsUsage,      props: smsProps },
];

// Roadmap — placeholders for later.
export const SOON: ComponentMeta[] = [
  { id: "salesforce-record",  name: "salesforce-record",  title: "Salesforce record",  accent: "oklch(0.74 0.10 220)", summary: "Update an Account, Lead, or Opportunity. Field-level diffs, validation rules.", status: "soon", category: "crm" },
  { id: "google-doc",         name: "google-doc",         title: "Google Doc edit",    accent: "oklch(0.78 0.04 240)", summary: "Inline doc edits with track-changes. Suggesting vs editing modes.", status: "soon", category: "docs" },
  { id: "discord-message",    name: "discord-message",    title: "Discord message",    accent: "oklch(0.74 0.13 280)", summary: "Post in a channel or DM. Embeds, mentions, reply context.", status: "soon", category: "messaging" },
];

export const REGISTRY: Array<RegistryEntry | ComponentMeta> = [...STABLE, ...SOON];

export function findEntry(slug: string): RegistryEntry | ComponentMeta | undefined {
  return REGISTRY.find(r => r.id === slug);
}

export function findStable(slug: string): RegistryEntry | undefined {
  return STABLE.find(r => r.id === slug);
}

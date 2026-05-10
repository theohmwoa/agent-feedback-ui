import type { AgentMeta } from "../../types";

export type GdocChangeKind = "insertion" | "deletion" | "formatting";
export type GdocMode = "suggesting" | "editing";

export type GdocChange = {
  kind: GdocChangeKind;
  text: string;        // the inserted/deleted text or "{old} → {new}" for formatting
  context?: string;    // surrounding paragraph context
};

export type GdocIntent = AgentMeta & {
  docTitle: string;
  folder: string[];   // breadcrumb path, e.g. ["Drive", "Marketing", "Q3 Launches"]
  changes: GdocChange[];
  finalPreview: string;
  defaultMode?: GdocMode;
};

export type GdocPayload = {
  mode: GdocMode;
  changes: GdocChange[];
};

export const GDOC_DEFAULT: GdocIntent = {
  agent: "atlas",
  action: "edit-doc",
  docTitle: "Q3 launch — narrative draft v3",
  folder: ["Drive", "Marketing", "Q3 Launches"],
  changes: [
    {
      kind: "insertion",
      text: "Customers see ~30% faster time-to-first-render after the rollout.",
      context: "After the §2 \"Outcomes\" heading.",
    },
    {
      kind: "deletion",
      text: "We expect to ship in Q4 (subject to QA bandwidth).",
      context: "§3 \"Timeline\" — replaced by the new ship date.",
    },
    {
      kind: "formatting",
      text: "Body — 14pt → 16pt, line-height 1.4 → 1.6",
      context: "Top-level body style.",
    },
    {
      kind: "insertion",
      text: "Risks: rollback plan needs sign-off from Priya before launch.",
      context: "Appended to §5 \"Risks\".",
    },
  ],
  finalPreview: `# Q3 launch — narrative draft v3

## 1. Executive summary
We're shipping the unified onboarding redesign on June 15.

## 2. Outcomes
Customers see ~30% faster time-to-first-render after the rollout.

## 3. Timeline
Ships June 15. Soft launch to 10% of orgs first.

## 5. Risks
Rollback plan needs sign-off from Priya before launch.`,
  defaultMode: "suggesting",
  rationale: "Pulled the new metric from your dashboard share, the ship date from PR #4187 milestone, and the rollback note from your Slack DM with Priya.",
};

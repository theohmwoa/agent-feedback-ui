import type { AgentMeta } from "../../types";

export type PinterestIntent = AgentMeta & {
  imageUrl: string;
  title: string;
  description: string;
  board: string;
  boards: string[];
  link?: string;
  tags: string[];
  altText?: string;
};

export type PinterestPayload = {
  imageUrl: string;
  title: string;
  description: string;
  board: string;
  link?: string;
  tags: string[];
  altText?: string;
};

export const PINTEREST_DEFAULT: PinterestIntent = {
  agent: "atlas",
  action: "create-pin",
  imageUrl: "https://placehold.co/600x400",
  title: "Brutalist concrete benches — moodboard #4",
  description: "Five raw-concrete bench shapes for the lobby refit. Saved alongside the Tadao Ando pulls from earlier this week so they share a board.",
  board: "Lobby — concrete moodboard",
  boards: [
    "Lobby — concrete moodboard",
    "Furniture pulls 2026",
    "Studio inspiration",
    "Material library",
    "Public spaces",
  ],
  link: "https://nordlight.studio/notes/lobby-refit-concrete",
  tags: ["brutalism", "concrete", "bench", "interior", "moodboard"],
  altText: "Five raw concrete benches photographed against a white wall with overhead lighting.",
  rationale: "Pulled from the lobby-refit board you started Tuesday. Title and tags match the existing pin clusters there.",
};

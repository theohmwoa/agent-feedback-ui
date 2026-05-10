import type { AgentMeta } from "../../types";

export type TelegramTarget =
  | { kind: "channel"; name: string; subscribers: number }
  | { kind: "user"; name: string; handle: string };

export type TelegramIntent = AgentMeta & {
  target: TelegramTarget;
  message: string;
  scheduleAt?: string;
  silent?: boolean;
};

export type TelegramPayload = {
  target: TelegramTarget;
  message: string;
  scheduleAt?: string;
  silent: boolean;
};

export const TELEGRAM_DEFAULT: TelegramIntent = {
  agent: "atlas",
  action: "send-telegram",
  target: { kind: "channel", name: "Northwind Build Status", subscribers: 482 },
  message: "*Build #4419* finished — `auth-gateway` v3.4.0 promoted to prod.\n\nKey metrics:\n• `/verify` p99: 880ms → 130ms\n• Error rate: 0.04% (steady)\n\nFull notes in #release-notes.",
  silent: false,
  rationale: "Drafted from CI build #4419 + the deployment summary. Channel formatting matches your last build status post.",
};

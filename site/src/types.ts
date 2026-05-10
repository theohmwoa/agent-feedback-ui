// The single result envelope every agent-ui component emits.
//
// `submit` — the user accepted the agent's draft as-is.
// `edit`   — the user changed something. Same payload shape; `diff` is optional.
// `cancel` — the user dismissed the action. The agent should treat this as "abort".

export type ReviewResult<T> =
  | { kind: "submit"; payload: T; summary?: string }
  | { kind: "edit"; payload: T; diff?: unknown; summary?: string }
  | { kind: "cancel"; summary?: string };

// Common agent-ui props shared by every component.
export type AgentMeta = {
  agent?: string;
  action?: string;
  rationale?: string;
};

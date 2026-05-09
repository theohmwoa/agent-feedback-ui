/**
 * The strategy executor. One pure function: given an action, the user's
 * edit, and the chosen strategy, produce the protocol-neutral
 * `RewriteResult` that a runtime adapter applies to its chain.
 *
 * No I/O, no state, no framework imports. Adapters do the actual work
 * of translating `RewriteResult.chainOps` into their native chain
 * representation.
 */

import type {
  Action,
  ChainOp,
  Edit,
  FeedbackStrategy,
  RewriteResult,
} from "./types.js";

/**
 * Apply a feedback strategy to a (action, edit) pair.
 *
 * Truth table for outcome × strategy:
 *
 *   accept  →  passthrough (no chain ops, regardless of strategy)
 *   reject  →  rejected=true (or retry=true under the retry strategy)
 *   modify  →  strategy-specific (see each branch below)
 */
export function applyFeedback<TPayload = unknown>(
  action: Action<TPayload>,
  edit: Edit<TPayload>,
  strategy: FeedbackStrategy,
): RewriteResult<TPayload> {
  if (edit.outcome.kind === "accept") {
    return passthrough(action.payload);
  }

  if (edit.outcome.kind === "reject") {
    return handleReject(action, edit.outcome.reason, strategy);
  }

  // outcome.kind === "modify"
  return handleModify(action, edit, edit.outcome.payload, edit.outcome.notes, strategy);
}

function passthrough<T>(payload: T): RewriteResult<T> {
  return {
    effectivePayload: payload,
    chainOps: [],
    retry: false,
    rejected: false,
  };
}

function handleReject<T>(
  action: Action<T>,
  reason: string | undefined,
  strategy: FeedbackStrategy,
): RewriteResult<T> {
  if (strategy.kind === "retry") {
    const reasonText = reason ?? "no reason given";
    return {
      effectivePayload: action.payload,
      chainOps: [
        {
          kind: "append_message",
          afterStepId: action.context?.stepId,
          role: "user",
          content: `Discard the previous draft and try again. Reason: ${reasonText}`,
        },
      ],
      retry: true,
      rejected: false,
    };
  }
  return {
    effectivePayload: action.payload,
    chainOps: [],
    retry: false,
    rejected: true,
  };
}

function handleModify<T>(
  action: Action<T>,
  edit: Edit<T>,
  newPayload: T,
  notes: string | undefined,
  strategy: FeedbackStrategy,
): RewriteResult<T> {
  switch (strategy.kind) {
    case "silent":
      return silentModify(action, newPayload);
    case "visible":
      return visibleModify(action, newPayload, notes);
    case "retry":
      return retryModify(action, newPayload, notes);
    case "constraint":
      return constraintModify(action, edit, newPayload, strategy.extractRule);
  }
}

function silentModify<T>(action: Action<T>, newPayload: T): RewriteResult<T> {
  const chainOps: ChainOp[] = action.context?.stepId
    ? [
        {
          kind: "replace_step",
          stepId: action.context.stepId,
          payload: newPayload,
        },
      ]
    : [];
  return {
    effectivePayload: newPayload,
    chainOps,
    retry: false,
    rejected: false,
  };
}

function visibleModify<T>(
  action: Action<T>,
  newPayload: T,
  notes: string | undefined,
): RewriteResult<T> {
  const noteSuffix = notes ? `\n\nReason: ${notes}` : "";
  return {
    effectivePayload: newPayload,
    chainOps: [
      {
        kind: "append_message",
        afterStepId: action.context?.stepId,
        role: "user",
        content: `I revised your ${action.type} draft.${noteSuffix}`,
      },
    ],
    retry: false,
    rejected: false,
  };
}

function retryModify<T>(
  action: Action<T>,
  newPayload: T,
  notes: string | undefined,
): RewriteResult<T> {
  const noteText = notes ?? "I edited the draft. Use my version as guidance, then re-emit your own.";
  return {
    effectivePayload: action.payload,
    chainOps: [
      {
        kind: "append_message",
        afterStepId: action.context?.stepId,
        role: "user",
        content: `Re-draft the ${action.type}. Notes: ${noteText}\n\nMy version (for reference, not necessarily verbatim): ${stableStringify(newPayload)}`,
      },
    ],
    retry: true,
    rejected: false,
  };
}

function constraintModify<T>(
  action: Action<T>,
  edit: Edit<T>,
  newPayload: T,
  extractRule: (a: Action, e: Edit) => string,
): RewriteResult<T> {
  const rule = extractRule(action as Action, edit as Edit);
  const chainOps: ChainOp[] = [];
  if (action.context?.stepId) {
    chainOps.push({
      kind: "replace_step",
      stepId: action.context.stepId,
      payload: newPayload,
    });
  }
  chainOps.push({ kind: "append_system_constraint", content: rule });
  return {
    effectivePayload: newPayload,
    chainOps,
    retry: false,
    rejected: false,
    systemConstraint: rule,
  };
}

/**
 * `JSON.stringify` with stable key ordering. Used in retry messages so
 * the prompt seen by the agent is deterministic across runs (which
 * matters for prompt cache hits when the same workflow is retried).
 */
function stableStringify(value: unknown): string {
  return JSON.stringify(value, sortedKeys);
}

function sortedKeys(_key: string, value: unknown): unknown {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }
  const obj = value as Record<string, unknown>;
  const sorted: Record<string, unknown> = {};
  for (const k of Object.keys(obj).sort()) {
    sorted[k] = obj[k];
  }
  return sorted;
}

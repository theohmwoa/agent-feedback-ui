/**
 * Vercel AI SDK adapter.
 *
 * Wraps a tool definition so its `execute` opens a feedback modal before
 * the side effect actually runs. Pure logic — the React modal lifecycle
 * lives in `templates`. This file only deals in promises.
 *
 * We intentionally don't import from `ai` directly. The AI SDK's `Tool`
 * type signature drifts between versions, and we don't actually use the
 * runtime — only the call shape. Defining our own structural type keeps
 * the adapter compatible across SDK versions and makes the test suite
 * runnable without the SDK installed.
 */

import { applyFeedback } from "../strategy.js";
import type {
  Action,
  Edit,
  FeedbackStrategy,
  RewriteResult,
} from "../types.js";

/**
 * Structural shape that matches Vercel AI SDK's `Tool<Args, Result>`
 * (and most other agent-framework tool definitions). We only require
 * what we touch: an `execute` function. Everything else is preserved
 * verbatim from the input tool by the wrapper.
 */
export interface ToolLike<TArgs = unknown, TResult = unknown> {
  description?: string;
  parameters?: unknown;
  execute?: (args: TArgs, context?: unknown) => Promise<TResult> | TResult;
  // Allow any extra fields the host SDK adds (caching keys, schemas, etc).
  [extra: string]: unknown;
}

/**
 * Function the React layer (or any UI host) provides: given an action,
 * open the modal, await the user's edit, return it. The adapter doesn't
 * care how the modal is rendered.
 */
export type ModalOpener<TArgs = unknown> = (
  action: Action<TArgs>,
) => Promise<Edit<TArgs>>;

export interface WithFeedbackOptions<TArgs> {
  /** How the user's edit reshapes the agent's chain. */
  strategy: FeedbackStrategy;
  /** Function that opens the action's modal and resolves with the edit. */
  openModal: ModalOpener<TArgs>;
  /**
   * Called when a `constraint` strategy produces a system-prompt rule.
   * The host should persist this somewhere it can be threaded into
   * future agent turns (typically session-scoped state).
   */
  onConstraint?: (rule: string) => void;
  /**
   * Optional id factory. Defaults to `crypto.randomUUID()` where
   * available, falling back to a timestamp + counter for environments
   * without it.
   */
  generateId?: () => string;
}

/**
 * Thrown by the wrapped tool's `execute` when the user rejects the
 * action outright. Hosts catch this in their tool-error handler and
 * either short-circuit the agent loop or surface the rejection to the
 * model as a tool error.
 */
export class FeedbackRejectedError extends Error {
  constructor(
    public readonly actionId: string,
    public readonly reason?: string,
  ) {
    super(
      reason
        ? `Feedback rejected for ${actionId}: ${reason}`
        : `Feedback rejected for ${actionId}`,
    );
    this.name = "FeedbackRejectedError";
  }
}

/**
 * Thrown when the configured strategy is `retry` and the user's edit
 * implies the agent should redraft. Inside an `execute` callback there's
 * no clean way to redirect the agent's next turn, so the retry strategy
 * surfaces here as an error the host's higher-level loop catches and
 * uses to inject the retry prompt + re-call the agent.
 *
 * If you want retry to "just work" inside `execute`, don't use this
 * adapter — wire feedback at the message-array level instead (a
 * higher-level adapter ships in a future commit).
 */
export class FeedbackRetryError extends Error {
  constructor(
    public readonly actionId: string,
    public readonly retryPromptContent: string,
  ) {
    super(`Feedback strategy is 'retry' for ${actionId}; host must redrive`);
    this.name = "FeedbackRetryError";
  }
}

/**
 * Wrap a tool so its `execute` is gated by a user-edit modal.
 *
 * For the three strategies that fit inside a single `execute` call
 * (silent, visible, constraint), the user's edit produces an
 * `effectivePayload`, the original `execute` runs against it, and any
 * `chainOps` that should be persisted upstream are surfaced through
 * `options.onConstraint`. (The `replace_step` and `append_message`
 * chain ops aren't relevant here — the AI SDK records the tool call
 * with the args we pass to `execute`, so passing `effectivePayload`
 * already achieves the silent rewrite, and the visible-correction
 * message is best appended at the message-array level by the host.)
 *
 * For the `retry` strategy this wrapper throws `FeedbackRetryError`,
 * because in-flight `execute` can't redrive the agent.
 *
 * The original tool object is shallow-cloned and any extra fields
 * (parameters schema, caching keys, etc.) are preserved.
 */
export function withFeedback<TArgs, TResult>(
  tool: ToolLike<TArgs, TResult>,
  toolName: string,
  options: WithFeedbackOptions<TArgs>,
): ToolLike<TArgs, TResult> {
  const { strategy, openModal, onConstraint } = options;
  const generateId = options.generateId ?? defaultId;

  const original = tool.execute;
  if (!original) {
    throw new Error(
      `withFeedback: tool ${toolName} has no execute function to wrap`,
    );
  }

  const wrapped: ToolLike<TArgs, TResult> = {
    ...tool,
    execute: async (args: TArgs, ctx?: unknown) => {
      const action: Action<TArgs> = {
        type: toolName,
        id: generateId(),
        payload: args,
      };
      const edit = await openModal(action);
      const result: RewriteResult<TArgs> = applyFeedback(action, edit, strategy);

      if (result.rejected) {
        const reason =
          edit.outcome.kind === "reject" ? edit.outcome.reason : undefined;
        throw new FeedbackRejectedError(action.id, reason);
      }
      if (result.retry) {
        const retryOp = result.chainOps.find(
          (op) => op.kind === "append_message",
        );
        const retryContent =
          retryOp && retryOp.kind === "append_message" ? retryOp.content : "";
        throw new FeedbackRetryError(action.id, retryContent);
      }
      if (result.systemConstraint && onConstraint) {
        onConstraint(result.systemConstraint);
      }

      return original(result.effectivePayload, ctx);
    },
  };

  return wrapped;
}

function defaultId(): string {
  if (
    typeof globalThis !== "undefined" &&
    typeof (globalThis as { crypto?: { randomUUID?: () => string } }).crypto
      ?.randomUUID === "function"
  ) {
    return (
      globalThis as { crypto: { randomUUID: () => string } }
    ).crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID.
  return `act-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

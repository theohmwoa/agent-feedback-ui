/**
 * React context that wires the modal-opener seam.
 *
 * Without this, consumers using `withFeedback(...)` have to manage
 * pending-action state themselves and produce the `(action) =>
 * Promise<Edit>` modal opener by hand. With this, they wrap their
 * tree in `<FeedbackProvider templates={...}>` and call
 * `useOpenAction()` to get a ready-made opener.
 *
 * Concurrent openAction() calls are queued: only one modal is shown
 * at a time, others wait their turn. Real agents sometimes emit
 * multiple tool calls in a single response; queueing keeps the user
 * from missing one.
 */

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

import type { Action, Edit } from "../types.js";

/**
 * The shape every template implements: takes an `Action<T>`, emits
 * an `Edit<T>` via `onSubmit`. Library-shipped templates (EmailModal,
 * SlackModal, etc.) all conform to this — and consumers' own
 * templates can drop in alongside.
 */
export interface ActionTemplateProps<TPayload = unknown> {
  action: Action<TPayload>;
  onSubmit: (edit: Edit<TPayload>) => void;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type ActionTemplate = React.ComponentType<ActionTemplateProps<any>>;

interface PendingEntry {
  action: Action<unknown>;
  resolve: (edit: Edit<unknown>) => void;
}

interface FeedbackContextValue {
  openAction: <T>(action: Action<T>) => Promise<Edit<T>>;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export interface FeedbackProviderProps {
  /** Map from `action.type` to the template that renders it. */
  templates: Record<string, ActionTemplate>;
  /**
   * Optional fallback rendered when an action arrives whose `type`
   * isn't in `templates`. Defaults to a tiny diagnostic component
   * that surfaces the unknown type and emits a `reject` Edit so the
   * agent loop unblocks.
   */
  unknownActionFallback?: ActionTemplate;
  children: ReactNode;
}

export function FeedbackProvider({
  templates,
  unknownActionFallback,
  children,
}: FeedbackProviderProps) {
  const queueRef = useRef<PendingEntry[]>([]);
  const [head, setHead] = useState<PendingEntry | null>(null);

  const openAction = useCallback(<T,>(action: Action<T>): Promise<Edit<T>> => {
    return new Promise<Edit<T>>((resolve) => {
      const entry: PendingEntry = {
        action: action as Action<unknown>,
        resolve: resolve as (edit: Edit<unknown>) => void,
      };
      queueRef.current.push(entry);
      // Promote to head only if nothing is pending.
      setHead((current) => current ?? entry);
    });
  }, []);

  const handleSubmit = useCallback((edit: Edit<unknown>) => {
    setHead((current) => {
      if (!current) return current;
      current.resolve(edit);
      queueRef.current.shift();
      return queueRef.current[0] ?? null;
    });
  }, []);

  const Template = head
    ? (templates[head.action.type] ??
      unknownActionFallback ??
      DefaultUnknownActionFallback)
    : null;

  return (
    <FeedbackContext.Provider value={{ openAction }}>
      {children}
      {head && Template ? (
        <Template action={head.action} onSubmit={handleSubmit} />
      ) : null}
    </FeedbackContext.Provider>
  );
}

/**
 * Hook for consumer components. Returns the `(action) => Promise<Edit>`
 * function suitable for passing as `openModal` to `withFeedback`.
 *
 * Throws if called outside a `FeedbackProvider` — that's almost always
 * a wiring mistake, and silent fallbacks would manifest as agent loops
 * that hang waiting for a modal that never appears.
 */
export function useOpenAction(): <T>(action: Action<T>) => Promise<Edit<T>> {
  const ctx = useContext(FeedbackContext);
  if (!ctx) {
    throw new Error(
      "useOpenAction must be called inside a <FeedbackProvider>",
    );
  }
  return ctx.openAction;
}

/**
 * Fallback for actions whose type isn't in the registry. Shows the
 * action's payload as JSON and offers Approve / Reject so the agent
 * loop doesn't hang on an unknown tool call.
 */
function DefaultUnknownActionFallback({
  action,
  onSubmit,
}: ActionTemplateProps): React.ReactElement {
  return (
    <div
      className="afu-modal afu-unknown-action"
      role="dialog"
      aria-label={`Unknown action: ${action.type}`}
    >
      <div className="afu-unknown-action__header">
        <strong>Unknown action: {action.type}</strong>
        <small>
          No template registered for this action type. Add one to your
          FeedbackProvider's <code>templates</code> map, or pass
          <code>unknownActionFallback</code> for custom rendering.
        </small>
      </div>
      <pre className="afu-unknown-action__payload">
        {JSON.stringify(action.payload, null, 2)}
      </pre>
      <div className="afu-unknown-action__actions">
        <button
          type="button"
          onClick={() =>
            onSubmit({
              actionId: action.id,
              outcome: { kind: "reject", reason: `unknown action type: ${action.type}` },
            })
          }
        >
          Reject
        </button>
        <button
          type="button"
          onClick={() =>
            onSubmit({ actionId: action.id, outcome: { kind: "accept" } })
          }
        >
          Approve as-is
        </button>
      </div>
    </div>
  );
}

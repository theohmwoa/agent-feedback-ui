/**
 * FeedbackProvider tests.
 *
 * Cover the whole modal-opener seam: a single openAction resolves on
 * submit, concurrent openActions queue properly (only one modal shown
 * at a time, second resolves after first), unknown action types fall
 * back to the default fallback (or a custom one), and useOpenAction
 * outside a provider throws.
 */

import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FeedbackProvider, useOpenAction } from "./provider.js";
import type { Action, Edit } from "../types.js";

interface FooPayload {
  msg: string;
}
interface BarPayload {
  count: number;
}

function FooTemplate({
  action,
  onSubmit,
}: {
  action: Action<FooPayload>;
  onSubmit: (edit: Edit<FooPayload>) => void;
}) {
  return (
    <div data-testid="foo-template">
      <span data-testid="foo-msg">{action.payload.msg}</span>
      <button
        data-testid="foo-accept"
        onClick={() =>
          onSubmit({ actionId: action.id, outcome: { kind: "accept" } })
        }
      >
        accept
      </button>
      <button
        data-testid="foo-modify"
        onClick={() =>
          onSubmit({
            actionId: action.id,
            outcome: { kind: "modify", payload: { msg: "edited!" } },
          })
        }
      >
        modify
      </button>
    </div>
  );
}

function BarTemplate({
  action,
  onSubmit,
}: {
  action: Action<BarPayload>;
  onSubmit: (edit: Edit<BarPayload>) => void;
}) {
  return (
    <div data-testid="bar-template">
      <span data-testid="bar-count">{action.payload.count}</span>
      <button
        data-testid="bar-accept"
        onClick={() =>
          onSubmit({ actionId: action.id, outcome: { kind: "accept" } })
        }
      >
        accept
      </button>
    </div>
  );
}

const TEMPLATES = { foo: FooTemplate as any, bar: BarTemplate as any };

// ---- single openAction round-trip -----------------------------------------

describe("FeedbackProvider single round-trip", () => {
  it("openAction resolves with the submitted Edit", async () => {
    let openAction!: <T>(a: Action<T>) => Promise<Edit<T>>;
    function Capturer() {
      openAction = useOpenAction();
      return null;
    }

    render(
      <FeedbackProvider templates={TEMPLATES}>
        <Capturer />
      </FeedbackProvider>,
    );

    let resolved: Edit<FooPayload> | null = null;
    await act(async () => {
      void openAction<FooPayload>({
        type: "foo",
        id: "act-1",
        payload: { msg: "hi" },
      }).then((edit) => {
        resolved = edit;
      });
    });

    // The modal should render synchronously after openAction resolves
    // its outer setState.
    expect(screen.getByTestId("foo-template")).toBeTruthy();
    expect(screen.getByTestId("foo-msg").textContent).toBe("hi");

    await act(async () => {
      fireEvent.click(screen.getByTestId("foo-accept"));
    });

    expect(resolved).toEqual({
      actionId: "act-1",
      outcome: { kind: "accept" },
    });
    // Modal should be removed from the DOM after submit.
    expect(screen.queryByTestId("foo-template")).toBeNull();
  });

  it("submitting a `modify` resolves with the edit's payload", async () => {
    let openAction!: <T>(a: Action<T>) => Promise<Edit<T>>;
    function Capturer() {
      openAction = useOpenAction();
      return null;
    }

    render(
      <FeedbackProvider templates={TEMPLATES}>
        <Capturer />
      </FeedbackProvider>,
    );

    let resolved: Edit<FooPayload> | null = null;
    await act(async () => {
      void openAction<FooPayload>({
        type: "foo",
        id: "act-1",
        payload: { msg: "hi" },
      }).then((edit) => {
        resolved = edit;
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("foo-modify"));
    });

    expect(resolved).toMatchObject({
      actionId: "act-1",
      outcome: { kind: "modify", payload: { msg: "edited!" } },
    });
  });
});

// ---- queueing -------------------------------------------------------------

describe("FeedbackProvider queues concurrent openActions", () => {
  it("renders only the head of the queue; second action waits", async () => {
    let openAction!: <T>(a: Action<T>) => Promise<Edit<T>>;
    function Capturer() {
      openAction = useOpenAction();
      return null;
    }

    render(
      <FeedbackProvider templates={TEMPLATES}>
        <Capturer />
      </FeedbackProvider>,
    );

    let firstResolved = false;
    let secondResolved = false;

    await act(async () => {
      void openAction<FooPayload>({
        type: "foo",
        id: "act-1",
        payload: { msg: "first" },
      }).then(() => {
        firstResolved = true;
      });
      void openAction<BarPayload>({
        type: "bar",
        id: "act-2",
        payload: { count: 42 },
      }).then(() => {
        secondResolved = true;
      });
    });

    // Only the foo template (first in queue) should render.
    expect(screen.getByTestId("foo-template")).toBeTruthy();
    expect(screen.queryByTestId("bar-template")).toBeNull();
    expect(firstResolved).toBe(false);
    expect(secondResolved).toBe(false);

    // Submit the first.
    await act(async () => {
      fireEvent.click(screen.getByTestId("foo-accept"));
    });
    expect(firstResolved).toBe(true);
    expect(secondResolved).toBe(false);

    // Now the bar template should be the head.
    expect(screen.queryByTestId("foo-template")).toBeNull();
    expect(screen.getByTestId("bar-template")).toBeTruthy();
    expect(screen.getByTestId("bar-count").textContent).toBe("42");

    // Submit the second.
    await act(async () => {
      fireEvent.click(screen.getByTestId("bar-accept"));
    });
    expect(secondResolved).toBe(true);
    expect(screen.queryByTestId("bar-template")).toBeNull();
  });
});

// ---- unknown action type fallback -----------------------------------------

describe("FeedbackProvider unknown action type", () => {
  it("default fallback shows the action's payload and offers reject + accept", async () => {
    let openAction!: <T>(a: Action<T>) => Promise<Edit<T>>;
    function Capturer() {
      openAction = useOpenAction();
      return null;
    }

    render(
      <FeedbackProvider templates={TEMPLATES}>
        <Capturer />
      </FeedbackProvider>,
    );

    let resolved: Edit<unknown> | null = null;
    await act(async () => {
      void openAction({
        type: "totally_unregistered",
        id: "act-1",
        payload: { stuff: "things" },
      }).then((edit) => {
        resolved = edit;
      });
    });

    expect(screen.getByText(/Unknown action: totally_unregistered/)).toBeTruthy();
    // Payload should appear in the JSON dump.
    expect(screen.getByText(/things/)).toBeTruthy();

    await act(async () => {
      fireEvent.click(screen.getByText("Reject"));
    });
    expect(resolved).toMatchObject({
      actionId: "act-1",
      outcome: { kind: "reject" },
    });
  });

  it("custom unknownActionFallback overrides the default", async () => {
    let openAction!: <T>(a: Action<T>) => Promise<Edit<T>>;
    function Capturer() {
      openAction = useOpenAction();
      return null;
    }

    function Custom({
      action,
      onSubmit,
    }: {
      action: Action<unknown>;
      onSubmit: (edit: Edit<unknown>) => void;
    }) {
      return (
        <div data-testid="custom-fallback">
          <button
            onClick={() =>
              onSubmit({
                actionId: action.id,
                outcome: { kind: "reject", reason: "custom" },
              })
            }
          >
            custom-reject
          </button>
        </div>
      );
    }

    render(
      <FeedbackProvider templates={TEMPLATES} unknownActionFallback={Custom as any}>
        <Capturer />
      </FeedbackProvider>,
    );

    let resolved: Edit<unknown> | null = null;
    await act(async () => {
      void openAction({
        type: "unregistered",
        id: "act-1",
        payload: {},
      }).then((edit) => {
        resolved = edit;
      });
    });

    expect(screen.getByTestId("custom-fallback")).toBeTruthy();
    await act(async () => {
      fireEvent.click(screen.getByText("custom-reject"));
    });
    expect(resolved).toMatchObject({
      actionId: "act-1",
      outcome: { kind: "reject", reason: "custom" },
    });
  });
});

// ---- guard: useOpenAction outside provider --------------------------------

describe("useOpenAction guard", () => {
  it("throws a clear error when called outside a FeedbackProvider", () => {
    function Naive() {
      useOpenAction();
      return null;
    }
    // Suppress the React error boundary console.error for this test —
    // we expect the throw and don't want noisy stderr in CI logs.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Naive />)).toThrow(
      /useOpenAction must be called inside a <FeedbackProvider>/,
    );
    spy.mockRestore();
  });
});
